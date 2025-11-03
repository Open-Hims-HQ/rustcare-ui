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

# Get the project root directory (parent of scripts directory)
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$PROJECT_ROOT"

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
echo -e "${YELLOW}Working directory: $PROJECT_ROOT${NC}"
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

# Check if node is installed, if not install it using nvm
if ! command -v node &> /dev/null; then
    echo "Node.js not found, installing via NVM..."
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    if ! command -v nvm &> /dev/null; then
        echo "Installing NVM..."
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    nvm install 20
    nvm use 20
fi

# Check if pnpm is installed, if not install it
if ! command -v pnpm &> /dev/null; then
    echo "pnpm not found, installing..."
    npm install -g pnpm
fi

pnpm install --prod --frozen-lockfile
ENDSSH

echo -e "${GREEN}✓ Production dependencies installed${NC}"
echo ""

# Step 5: Ensure systemd service exists and restart
echo -e "${BLUE}Step 5: Setting up systemd service and restarting...${NC}"

# Copy systemd service file if it doesn't exist
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSERVICEDEF'
if [ ! -f /etc/systemd/system/remix.service ]; then
    echo "Creating systemd service file..."
    
    sudo tee /etc/systemd/system/remix.service > /dev/null << 'EOF'
[Unit]
Description=RustCare Remix Application
After=network.target

[Service]
Type=simple
User=openhims
WorkingDirectory=/home/openhims/rustcare-ui
Environment="NVM_DIR=/home/openhims/.nvm"
Environment="PATH=/home/openhims/.nvm/versions/node/v20.0.0/bin:/usr/local/bin:/usr/bin:/bin"
ExecStart=/bin/bash -c '. /home/openhims/.nvm/nvm.sh && nvm use 20 && cd /home/openhims/rustcare-ui && pnpm start'
Restart=always
RestartSec=10
StandardOutput=append:/home/openhims/rustcare-ui/app.log
StandardError=append:/home/openhims/rustcare-ui/app.log

[Install]
WantedBy=multi-user.target
EOF
    
    sudo systemctl daemon-reload
    sudo systemctl enable remix.service
    echo "Service file created and enabled"
else
    echo "Service file already exists"
fi
ENDSERVICEDEF

# Restart the service
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP" << 'ENDSSH'
sudo systemctl daemon-reload
sudo systemctl restart remix.service
sleep 2
sudo systemctl status remix.service --no-pager
ENDSSH

echo -e "${GREEN}✓ Application restarted on server${NC}"
echo ""

# Summary
echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BLUE}================================${NC}"
echo ""
echo -e "${YELLOW}Application is running at:${NC}"
echo -e "  http://$SERVER_IP:3000"
echo ""
echo -e "${YELLOW}To view logs:${NC}"
echo -e "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'sudo journalctl -u remix.service -f'"
echo ""
echo -e "${YELLOW}To check status:${NC}"
echo -e "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'sudo systemctl status remix.service'"
echo ""
echo -e "${YELLOW}To restart manually:${NC}"
echo -e "  ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP 'sudo systemctl restart remix.service'"
echo ""
