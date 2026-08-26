#!/bin/bash

echo "🚀 Storyly Deployment to Instapod Server"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Configuration - EDIT THESE VALUES
read -p "Server username: " SERVER_USER
read -p "Server host (e.g., your.instapod.server): " SERVER_HOST
read -p "Server path (default: /var/www/storyly): " SERVER_PATH
SERVER_PATH=${SERVER_PATH:-/var/www/storyly}

read -p "Database password: " -s DB_PASSWORD
echo ""

read -p "Dashboard domain (e.g., storyly.yourdomain.com): " DOMAIN
read -p "API domain (e.g., api.yourdomain.com): " API_DOMAIN

echo ""
echo "📋 Configuration:"
echo "  Server: $SERVER_USER@$SERVER_HOST"
echo "  Path: $SERVER_PATH"
echo "  Dashboard: https://$DOMAIN"
echo "  API: https://$API_DOMAIN"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 1
fi

# Create deployment package
echo ""
echo "📦 Creating deployment package..."
cd "$(dirname "$0")"

# Copy files to server
echo "📤 Uploading files to server..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"

echo "  → Backend..."
rsync -avz --exclude node_modules --exclude dist backend/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/backend/

echo "  → Dashboard..."
rsync -avz --exclude node_modules --exclude dist dashboard/ $SERVER_USER@$SERVER_HOST:$SERVER_PATH/dashboard/

echo "  → Scripts..."
scp scripts/create-api-key.js $SERVER_USER@$SERVER_HOST:$SERVER_PATH/backend/scripts/

# Deploy on server
echo ""
echo "🔧 Setting up on server..."
ssh $SERVER_USER@$SERVER_HOST << ENDSSH

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Setting up PostgreSQL database..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sudo -u postgres psql << SQL
-- Create database and user if they don't exist
SELECT 'CREATE DATABASE storyly' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'storyly')\\gexec
DO \\\$\\\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'storyly_user') THEN
    CREATE USER storyly_user WITH PASSWORD '$DB_PASSWORD';
  END IF;
END
\\\$\\\$;
GRANT ALL PRIVILEGES ON DATABASE storyly TO storyly_user;
ALTER DATABASE storyly OWNER TO storyly_user;
SQL

echo "✅ Database ready"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚙️ Setting up Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $SERVER_PATH/backend

# Install dependencies
echo "  → Installing dependencies..."
npm install --production

# Create .env file
echo "  → Creating environment config..."
cat > .env << ENV
DATABASE_URL="postgresql://storyly_user:$DB_PASSWORD@localhost:5432/storyly?schema=public"
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://$DOMAIN
ENV

# Setup database
echo "  → Setting up database schema..."
npx prisma generate
npx prisma db push --skip-generate

# Create uploads directory
mkdir -p uploads

# Build backend
echo "  → Building backend..."
npm run build

# Create production API key
echo "  → Creating production API key..."
node scripts/create-api-key.js | tee /tmp/storyly-api-key.txt

# Start with PM2
echo "  → Starting backend with PM2..."
pm2 delete storyly-backend 2>/dev/null || true
pm2 start dist/index.js --name storyly-backend
pm2 save

echo "✅ Backend ready"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Setting up Dashboard..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd $SERVER_PATH/dashboard

# Install dependencies
echo "  → Installing dependencies..."
npm install

# Create production env
echo "  → Creating environment config..."
cat > .env.production << ENV
VITE_API_URL=https://$API_DOMAIN/api/v1
ENV

# Build dashboard
echo "  → Building dashboard..."
npm run build

echo "✅ Dashboard ready"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 Configuring Nginx..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backend nginx config
echo "  → Configuring backend..."
sudo tee /etc/nginx/sites-available/storyly-backend > /dev/null << 'NGINX'
server {
    listen 80;
    server_name $API_DOMAIN;

    client_max_body_size 100M;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /uploads/ {
        alias $SERVER_PATH/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
NGINX

# Dashboard nginx config
echo "  → Configuring dashboard..."
sudo tee /etc/nginx/sites-available/storyly-dashboard > /dev/null << 'NGINX'
server {
    listen 80;
    server_name $DOMAIN;

    root $SERVER_PATH/dashboard/dist;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
NGINX

# Enable sites
sudo ln -sf /etc/nginx/sites-available/storyly-backend /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/storyly-dashboard /etc/nginx/sites-enabled/

# Test and reload nginx
echo "  → Testing nginx config..."
sudo nginx -t

echo "  → Reloading nginx..."
sudo systemctl reload nginx

echo "✅ Nginx configured"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Your Production API Key:"
echo ""
cat /tmp/storyly-api-key.txt
echo ""
echo "🌐 Your URLs:"
echo "  Dashboard: http://$DOMAIN"
echo "  Backend:   http://$API_DOMAIN"
echo ""
echo "🔒 IMPORTANT: Setup SSL certificates:"
echo "  sudo certbot --nginx -d $DOMAIN -d $API_DOMAIN"
echo ""
echo "📱 Use in your Android app:"
echo ""
echo "  StorylyView("
echo "      apiKey = \"YOUR_API_KEY_FROM_ABOVE\","
echo "      backendUrl = \"https://$API_DOMAIN\""
echo "  )"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

ENDSSH

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "  1. Save your API key (shown above)"
echo "  2. Setup SSL: ssh $SERVER_USER@$SERVER_HOST 'sudo certbot --nginx -d $DOMAIN -d $API_DOMAIN'"
echo "  3. Test dashboard: http://$DOMAIN"
echo "  4. Update Android app with production URL"
echo ""
