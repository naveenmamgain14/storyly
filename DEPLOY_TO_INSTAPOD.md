# Deploy Storyly to Instapod Server

Deploy backend, database, and dashboard to your existing Instapod server.

---

## 📋 Prerequisites

- Instapod server with SSH access
- Node.js installed (v18+)
- PostgreSQL installed
- Nginx installed
- PM2 installed (for process management)

---

## 🚀 Quick Deploy Script

Run this from your **local machine**:

```bash
# Set your server details
SERVER_USER="your_username"
SERVER_HOST="your.instapod.server"
SERVER_PATH="/var/www/storyly"

# Deploy everything
scp -r /Users/E2289/Documents/claudecode/storyly/backend $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
scp -r /Users/E2289/Documents/claudecode/storyly/dashboard $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# SSH and setup
ssh $SERVER_USER@$SERVER_HOST
```

---

## 📦 Step 1: Setup Database on Server

SSH into your server and run:

```bash
# Create PostgreSQL database
sudo -u postgres psql

# In PostgreSQL:
CREATE DATABASE storyly;
CREATE USER storyly_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE storyly TO storyly_user;
\q

# Test connection
psql -U storyly_user -d storyly -h localhost
```

---

## 🔧 Step 2: Deploy Backend

### On your server:

```bash
# Navigate to backend directory
cd /var/www/storyly/backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://storyly_user:your_secure_password@localhost:5432/storyly?schema=public"
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://storyly.your-domain.com
EOF

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Create production API key
node scripts/create-api-key.js

# Build backend
npm run build

# Start with PM2
pm2 start dist/index.js --name storyly-backend
pm2 save
pm2 startup
```

### Configure Nginx for Backend:

```bash
sudo nano /etc/nginx/sites-available/storyly-backend
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name storyly-api.your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Serve uploaded files
    location /uploads/ {
        alias /var/www/storyly/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/storyly-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🎨 Step 3: Deploy Dashboard

### On your server:

```bash
cd /var/www/storyly/dashboard

# Install dependencies
npm install

# Create production env
cat > .env.production << EOF
VITE_API_URL=https://storyly-api.your-domain.com/api/v1
EOF

# Build for production
npm run build

# Built files will be in dist/
```

### Configure Nginx for Dashboard:

```bash
sudo nano /etc/nginx/sites-available/storyly-dashboard
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name storyly.your-domain.com;
    root /var/www/storyly/dashboard/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/storyly-dashboard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Step 4: Setup SSL (Let's Encrypt)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d storyly.your-domain.com -d storyly-api.your-domain.com

# Auto-renewal is already setup by certbot
```

---

## 📱 Step 5: Update Android SDK

Update your Android app to use the production server:

```kotlin
StorylyView(
    apiKey = "sk_prod_your_key_from_step_2",
    backendUrl = "https://storyly-api.your-domain.com"
)
```

---

## 🔧 Alternative: Deploy Everything on One Port

If you prefer a single domain:

### Nginx Configuration (Single Domain):

```nginx
server {
    listen 80;
    server_name storyly.your-domain.com;

    # Dashboard
    location / {
        root /var/www/storyly/dashboard/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Uploads
    location /uploads/ {
        alias /var/www/storyly/backend/uploads/;
        expires 30d;
    }
}
```

Then use:
```kotlin
StorylyView(
    apiKey = "sk_prod_your_key",
    backendUrl = "https://storyly.your-domain.com"
)
```

---

## 📝 Complete Deployment Script

Save this as `deploy-to-instapod.sh`:

```bash
#!/bin/bash

# Configuration
SERVER_USER="your_username"
SERVER_HOST="your.instapod.server"
SERVER_PATH="/var/www/storyly"
DB_PASSWORD="your_secure_password"
DOMAIN="storyly.your-domain.com"
API_DOMAIN="storyly-api.your-domain.com"

echo "🚀 Deploying Storyly to Instapod..."

# 1. Copy files to server
echo "📦 Copying files..."
ssh $SERVER_USER@$SERVER_HOST "mkdir -p $SERVER_PATH"
scp -r backend $SERVER_USER@$SERVER_HOST:$SERVER_PATH/
scp -r dashboard $SERVER_USER@$SERVER_HOST:$SERVER_PATH/

# 2. Setup on server
echo "🔧 Setting up on server..."
ssh $SERVER_USER@$SERVER_HOST << EOF

# Setup database
echo "📊 Setting up database..."
sudo -u postgres psql << SQL
CREATE DATABASE IF NOT EXISTS storyly;
CREATE USER IF NOT EXISTS storyly_user WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE storyly TO storyly_user;
SQL

# Setup backend
echo "⚙️ Setting up backend..."
cd $SERVER_PATH/backend
npm install
cat > .env << ENV
DATABASE_URL="postgresql://storyly_user:$DB_PASSWORD@localhost:5432/storyly?schema=public"
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://$DOMAIN
ENV
npx prisma generate
npx prisma db push
node scripts/create-api-key.js > /tmp/storyly-api-key.txt
npm run build
pm2 delete storyly-backend || true
pm2 start dist/index.js --name storyly-backend
pm2 save

# Setup dashboard
echo "🎨 Setting up dashboard..."
cd $SERVER_PATH/dashboard
npm install
cat > .env.production << ENV
VITE_API_URL=https://$API_DOMAIN/api/v1
ENV
npm run build

# Setup nginx
echo "🌐 Configuring Nginx..."
# Backend config
sudo tee /etc/nginx/sites-available/storyly-backend << NGINX
server {
    listen 80;
    server_name $API_DOMAIN;
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host \\\$host;
        proxy_set_header X-Real-IP \\\$remote_addr;
    }
    location /uploads/ {
        alias $SERVER_PATH/backend/uploads/;
    }
}
NGINX

# Dashboard config
sudo tee /etc/nginx/sites-available/storyly-dashboard << NGINX
server {
    listen 80;
    server_name $DOMAIN;
    root $SERVER_PATH/dashboard/dist;
    index index.html;
    location / {
        try_files \\\$uri \\\$uri/ /index.html;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/storyly-backend /etc/nginx/sites-enabled/
sudo ln -sf /etc/nginx/sites-available/storyly-dashboard /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo "✅ Deployment complete!"
echo ""
echo "📝 Your API key:"
cat /tmp/storyly-api-key.txt
echo ""
echo "🌐 URLs:"
echo "  Dashboard: https://$DOMAIN"
echo "  Backend:   https://$API_DOMAIN"
echo ""
echo "🔒 Don't forget to run: sudo certbot --nginx -d $DOMAIN -d $API_DOMAIN"

EOF

echo "✅ Done!"
```

Make it executable:
```bash
chmod +x deploy-to-instapod.sh
```

Run it:
```bash
./deploy-to-instapod.sh
```

---

## 🔄 Update/Redeploy

To update after making changes:

```bash
# On your server
cd /var/www/storyly/backend
git pull  # or copy new files
npm install
npm run build
pm2 restart storyly-backend

cd /var/www/storyly/dashboard
git pull  # or copy new files
npm install
npm run build
# Files auto-served by nginx
```

---

## 📊 Monitor

### Check backend status:
```bash
pm2 status
pm2 logs storyly-backend
```

### Check nginx:
```bash
sudo nginx -t
sudo systemctl status nginx
```

### Check database:
```bash
psql -U storyly_user -d storyly -c "SELECT COUNT(*) FROM stories;"
```

---

## 🌐 DNS Setup

Point your domains to your Instapod server:

```
A Record:  storyly              -> YOUR_SERVER_IP
A Record:  storyly-api          -> YOUR_SERVER_IP
```

Or use subdomains of existing domain:

```
A Record:  storyly.your-domain  -> YOUR_SERVER_IP
A Record:  api.your-domain      -> YOUR_SERVER_IP
```

---

## ✅ Verification

### 1. Test Backend:
```bash
curl https://storyly-api.your-domain.com/health
```

### 2. Test API:
```bash
curl -H "X-API-Key: YOUR_KEY" \
     https://storyly-api.your-domain.com/api/v1/sdk/stories
```

### 3. Test Dashboard:
Open: `https://storyly.your-domain.com`

### 4. Test in Android:
```kotlin
StorylyView(
    apiKey = "sk_prod_your_key",
    backendUrl = "https://storyly-api.your-domain.com"
)
```

---

## 🆘 Troubleshooting

### Backend not starting:
```bash
pm2 logs storyly-backend
# Check .env file
# Check database connection
```

### Nginx errors:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

### Database connection issues:
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U storyly_user -d storyly -h localhost
```

### CORS errors:
Update backend `.env`:
```bash
CORS_ORIGIN=https://storyly.your-domain.com
```
Then restart:
```bash
pm2 restart storyly-backend
```

---

## 📝 Summary

**What gets deployed:**
- ✅ Backend API on port 3001
- ✅ PostgreSQL database
- ✅ Dashboard static files
- ✅ Nginx reverse proxy
- ✅ SSL certificates

**Your URLs:**
- Dashboard: `https://storyly.your-domain.com`
- API: `https://storyly-api.your-domain.com`

**In your app:**
```kotlin
StorylyView(
    apiKey = "sk_prod_xxxxx",
    backendUrl = "https://storyly-api.your-domain.com"
)
```

**Done!** 🎉
