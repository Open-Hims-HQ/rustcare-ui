#!/bin/bash

# RustCare UI Deployment Script
# This script deploys the UI to the server and builds it there

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
SSH_KEY="open-hims_key.pem"
REMOTE_DIR="/home/openhims/rustcare-ui"
LOCAL_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  RustCare UI Deployment${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if SSH key exists
if [ ! -f "$SSH_KEY" ]; then
    # Check in parent directory (infra)
    if [ -f "../rustcare-infra/$SSH_KEY" ]; then
        SSH_KEY="../rustcare-infra/$SSH_KEY"
    else
        echo -e "${RED}✗ SSH key not found: $SSH_KEY${NC}"
        echo -e "${YELLOW}  Please ensure $SSH_KEY is in the current directory or rustcare-infra directory${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}Step 1: Testing SSH connection...${NC}"
if ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no -o ConnectTimeout=5 "$SERVER_USER@$SERVER_IP" "echo 'Connection successful'" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ SSH connection successful${NC}"
else
    echo -e "${RED}✗ Failed to connect to server${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Syncing files to server...${NC}"
echo -e "${YELLOW}Excluding: node_modules, build, .git, coverage${NC}"

# Use rsync to sync files (excluding build artifacts and dependencies)
rsync -avz --progress \
    -e "ssh -i $SSH_KEY -o StrictHostKeyChecking=no" \
    --exclude 'node_modules' \
    --exclude 'build' \
    --exclude '.git' \
    --exclude 'coverage' \
    --exclude 'html' \
    --exclude 'playwright-report' \
    --exclude 'test-results' \
    --exclude '.DS_Store' \
    --exclude '*.log' \
    "$LOCAL_DIR/" "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

echo -e "${GREEN}✓ Files synced successfully${NC}"

echo ""
echo -e "${BLUE}Step 3: Building on server...${NC}"

# Build on server
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
set -e

cd /home/openhims/rustcare-ui

echo "Checking Node.js and pnpm installation..."
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
    export PNPM_HOME="/home/openhims/.local/share/pnpm"
    export PATH="$PNPM_HOME:$PATH"
fi

echo "Installing dependencies..."
pnpm install --frozen-lockfile

echo "Building application..."
pnpm run build

echo "Build completed successfully!"
ls -lh build/

ENDSSH

echo ""
echo -e "${GREEN}✓ Build completed on server${NC}"

echo ""
echo -e "${BLUE}Step 4: Deployment summary${NC}"
echo -e "${GREEN}✓ Files synced to: $REMOTE_DIR${NC}"
echo -e "${GREEN}✓ Application built on server${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. SSH to server: ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP"
echo -e "  2. Start the application: cd $REMOTE_DIR && pnpm start"
echo -e "  3. Or set up as a service (see scripts/setup-service.sh)"
echo ""
