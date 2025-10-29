#!/bin/bash

# RustCare UI - Build Locally and Deploy to Server
# This script builds the application locally and copies build artifacts to the server

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

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    echo -e "${RED}✗ SSH key not found at: $SSH_KEY${NC}"
    exit 1
fi

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  RustCare UI Build & Deploy${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Step 1: Build locally
echo -e "${BLUE}Step 1: Building locally...${NC}"
pnpm run build

if [ ! -d "build" ]; then
    echo -e "${RED}✗ Build failed - build directory not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Local build completed${NC}"
echo ""

# Step 2: Copy build artifacts to server
echo -e "${BLUE}Step 2: Copying build artifacts to server...${NC}"

# First ensure remote directory structure exists
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" \
    "mkdir -p $REMOTE_DIR"

# Copy the build directory
rsync -avz --delete --progress \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    build/ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/build/"

echo -e "${GREEN}✓ Build artifacts copied to server${NC}"
echo ""

# Step 3: Copy package.json and other necessary files
echo -e "${BLUE}Step 3: Copying necessary files...${NC}"

rsync -avz --progress \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    --include 'package.json' \
    --include 'pnpm-lock.yaml' \
    --exclude '*' \
    ./ "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

echo -e "${GREEN}✓ Files synced${NC}"
echo ""

# Step 4: Install production dependencies on server
echo -e "${BLUE}Step 4: Installing production dependencies on server...${NC}"

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
cd /home/openhims/rustcare-ui
pnpm install --prod --frozen-lockfile
ENDSSH

echo -e "${GREEN}✓ Production dependencies installed${NC}"
echo ""

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${YELLOW}To start the application on the server:${NC}"
echo -e "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo -e "  cd $REMOTE_DIR"
echo -e "  pnpm start"
echo ""
echo -e "${YELLOW}Or run it in the background:${NC}"
echo -e "  nohup pnpm start > app.log 2>&1 &"
echo ""
