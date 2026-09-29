#!/bin/bash

echo "🚀 Starting Storyly Local Development Environment"
echo "=================================================="
echo ""

# Check if backend is built
if [ ! -d "backend/dist" ]; then
    echo "📦 Building backend..."
    cd backend && npm run build && cd ..
fi

# Start backend in background
echo "🔧 Starting Backend API on port 3001..."
cd backend && npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start dashboard
echo "🎨 Starting Dashboard on port 5173..."
echo ""
echo "=================================================="
echo "✅ Backend API: http://localhost:3001/api/v1"
echo "✅ Dashboard: http://localhost:5173"
echo "=================================================="
echo ""
echo "📋 API Keys:"
echo "  Storyly App: sk_35baf0a65c31b273ed2f9c043a49997f4769d78054128558ade21beb9380e23b"
echo "  Medicine App: sk_80a04e238f59d10ec6072aca8ad0cbcdead96cf2d32edf1c288e16c975216781"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

cd dashboard && npm run dev

# Cleanup on exit
kill $BACKEND_PID 2>/dev/null
