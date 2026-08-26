#!/bin/bash

echo "🚀 Storyly Quick Deploy to Railway"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo "🔐 Logging in to Railway..."
railway login

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Deploying Backend + Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd backend

echo "1️⃣ Creating Railway project..."
railway init

echo "2️⃣ Adding PostgreSQL database..."
railway add

echo "3️⃣ Deploying backend..."
railway up

echo "4️⃣ Setting environment variables..."
railway variables set NODE_ENV=production

echo "5️⃣ Running database migrations..."
railway run npx prisma db push

echo "6️⃣ Creating API key..."
railway run node scripts/create-api-key.js

echo ""
echo "✅ Backend deployed!"
BACKEND_URL=$(railway domain)
echo "🔗 Backend URL: https://$BACKEND_URL"
echo ""

cd ../dashboard

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎨 Deploying Dashboard"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣ Creating Railway project..."
railway init

echo "2️⃣ Setting environment variables..."
railway variables set VITE_API_URL=https://$BACKEND_URL/api/v1

echo "3️⃣ Deploying dashboard..."
railway up

echo ""
echo "✅ Dashboard deployed!"
DASHBOARD_URL=$(railway domain)
echo "🔗 Dashboard URL: https://$DASHBOARD_URL"
echo ""

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Deployment Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📱 Your Production URLs:"
echo ""
echo "   Backend:   https://$BACKEND_URL"
echo "   Dashboard: https://$DASHBOARD_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Copy your API key from above"
echo "2. Update your Android app:"
echo ""
echo "   StorylyView("
echo "       apiKey = \"YOUR_API_KEY\","
echo "       backendUrl = \"https://$BACKEND_URL\""
echo "   )"
echo ""
echo "3. Create stories at: https://$DASHBOARD_URL"
echo ""
echo "🎉 Done! Your SDK works from anywhere!"
echo ""
