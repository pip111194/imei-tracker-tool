#!/bin/bash

# IMEI Tracker Tool - Quick Start Script
# For Termux and Linux systems

echo "🚀 Starting IMEI Tracker Tool..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js first:"
    echo "  pkg install nodejs -y"
    exit 1
fi

# Check if in correct directory
if [ ! -f "api/server.js" ]; then
    echo -e "${RED}❌ Error: api/server.js not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "api/node_modules" ]; then
    echo -e "${BLUE}📦 Installing dependencies...${NC}"
    cd api
    npm install
    cd ..
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    echo ""
fi

# Kill existing processes
echo -e "${BLUE}🔄 Stopping existing processes...${NC}"
pkill -f "node.*server.js" 2>/dev/null
pkill -f "http-server" 2>/dev/null
sleep 2

# Start backend server
echo -e "${BLUE}🔧 Starting backend API server...${NC}"
cd api
node server.js &
BACKEND_PID=$!
cd ..
sleep 3

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi

# Check if http-server is installed
if ! command -v http-server &> /dev/null; then
    echo -e "${BLUE}📦 Installing http-server...${NC}"
    npm install -g http-server
    echo -e "${GREEN}✅ http-server installed${NC}"
fi

# Start frontend server
echo -e "${BLUE}🌐 Starting frontend server...${NC}"
http-server -p 8080 -c-1 &
FRONTEND_PID=$!
sleep 2

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ Failed to start frontend server${NC}"
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ IMEI Tracker Tool is now running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📱 Access the tool:${NC}"
echo ""
echo -e "  ${GREEN}Basic Version:${NC}"
echo "  http://localhost:8080/index.html"
echo ""
echo -e "  ${GREEN}Advanced Version:${NC}"
echo "  http://localhost:8080/advanced-tracker.html"
echo ""
echo -e "  ${GREEN}API Endpoint:${NC}"
echo "  http://localhost:3000/api"
echo ""
echo -e "  ${GREEN}API Health Check:${NC}"
echo "  http://localhost:3000/api/health"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  - README.md - General documentation"
echo "  - TERMUX_SETUP.md - Termux setup guide"
echo "  - BACKEND_DOCS.md - API documentation"
echo ""
echo -e "${BLUE}🛑 To stop the servers:${NC}"
echo "  pkill node"
echo "  pkill http-server"
echo ""
echo -e "${BLUE}💡 Test API with curl:${NC}"
echo '  curl http://localhost:3000/api/health'
echo '  curl -X POST http://localhost:3000/api/validate -H "Content-Type: application/json" -d '"'"'{"imei":"357174051234567"}'"'"
echo ""
echo -e "${GREEN}Happy tracking! 🎉${NC}"
echo ""

# Save PIDs to file for easy cleanup
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid