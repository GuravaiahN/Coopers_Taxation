#!/bin/bash

# Hostinger VPS Deployment Script for Coopers Taxation
# Run this script on your Hostinger VPS

set -e

echo "🚀 Starting deployment of Coopers Taxation..."

# Variables
APP_NAME="coopers-taxation"
DOMAIN="cooperstaxation.com"  # Updated with actual domain
APP_DIR="/var/www/$APP_NAME"
NGINX_CONFIG="/etc/nginx/sites-available/$APP_NAME"
PM2_APP_NAME="coopers-taxation"

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+ (required for Next.js)
echo "🟢 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 globally
echo "⚡ Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# Clone your repository (replace with your actual repository URL)
echo "📥 Downloading application code..."
cd $APP_DIR
# git clone https://github.com/yourusername/coopers-taxation.git .
# For now, you'll need to upload your files manually

# Install dependencies
echo "🔧 Installing dependencies..."
npm ci --production

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

# Create logs directory
mkdir -p logs

# Configure PM2
echo "⚡ Setting up PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup

echo "✅ Deployment completed!"
echo "🌍 Your application should be running on port 3000"
echo "🔧 Next steps:"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Set up SSL certificate"
echo "   3. Configure Nginx reverse proxy"