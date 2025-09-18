#!/bin/bash

# Portfolio Development Script
echo "🚀 Starting Imane's Portfolio Development Server..."

# Navigate to the React portfolio directory
cd "$(dirname "$0")/react-portfolio"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "🌟 Launching portfolio at http://localhost:3000"
echo "💡 Press Ctrl+C to stop the server"
echo ""

npm start