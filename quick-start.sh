#!/bin/bash

# RustCare UI Quick Start Script
# Starts the UI development server with proper configuration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  RustCare UI Quick Start${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOF
# API Configuration
API_BASE_URL=https://api.openhims.health/api/v1

# Development - Allow self-signed certificates
NODE_TLS_REJECT_UNAUTHORIZED=0
NODE_ENV=development
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    pnpm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
fi

# Check if backend is running
echo -e "${BLUE}Checking backend connectivity...${NC}"
if curl -k -s -o /dev/null -w "%{http_code}" https://api.openhims.health/health | grep -q "200"; then
    echo -e "${GREEN}✓ Backend is running${NC}"
else
    echo -e "${YELLOW}⚠ Warning: Backend might not be running at https://api.openhims.health${NC}"
    echo -e "${YELLOW}  Please start the backend first with: cd ../rustcare-engine && ./quick-start.sh${NC}"
fi

echo ""
echo -e "${BLUE}Starting UI development server...${NC}"
echo -e "${GREEN}UI will be available at: http://localhost:3000${NC}"
echo -e "${GREEN}API proxy configured for: https://api.openhims.health${NC}"
echo ""

# Start the development server
pnpm run dev
