#!/bin/bash

# IMEI Tracker Tool - Stop Script

echo "🛑 Stopping IMEI Tracker Tool..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Kill processes by PID files
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null 2>&1; then
        kill $BACKEND_PID
        echo -e "${GREEN}✅ Backend server stopped (PID: $BACKEND_PID)${NC}"
    fi
    rm .backend.pid
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null 2>&1; then
        kill $FRONTEND_PID
        echo -e "${GREEN}✅ Frontend server stopped (PID: $FRONTEND_PID)${NC}"
    fi
    rm .frontend.pid
fi

# Fallback: kill by process name
pkill -f "node.*server.js" 2>/dev/null
pkill -f "http-server" 2>/dev/null

echo -e "${GREEN}✅ All servers stopped${NC}"