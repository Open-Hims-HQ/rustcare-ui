#!/bin/bash

# RustCare UI - Build on Server Script
# This script connects to the server and builds the application there

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SERVER_USER="openhims"
SERVER_IP="20.197.44.40"
SSH_KEY="$HOME/Projects/rustcare-infra/open-hims_key.pem"
REMOTE_DIR="/home/openhims/rustcare-ui"

# Check if SSH key exists in infra directory
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}✗ SSH key not found at: $SSH_KEY${NC}"
    exit 1
fi

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Building RustCare UI on Server${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

echo -e "${BLUE}Connecting to server and building...${NC}"
echo ""

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

cd /home/openhims/rustcare-ui

echo "📦 Installing dependencies..."
pnpm install

echo ""
echo "🔨 Building application..."
pnpm run build

echo ""
echo "✅ Build completed successfully!"
echo ""
echo "Build output:"
ls -lh build/server/ build/client/ 2>/dev/null || ls -lh build/

ENDSSH

echo ""
echo -e "${GREEN}✓ Build completed on server${NC}"
echo -e "${YELLOW}To start the application:${NC}"
echo -e "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo -e "  cd $REMOTE_DIR && pnpm start"
echo ""
