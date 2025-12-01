# Hostinger Deployment Checklist

## Pre-Deployment
- [ ] Environment variables configured (.env.local)
- [ ] MongoDB database set up and accessible
- [ ] Domain purchased and DNS configured
- [ ] Code tested in production mode locally
- [ ] Backup strategy planned

## VPS Setup
- [ ] Ubuntu VPS provisioned
- [ ] SSH access configured
- [ ] Node.js 18+ installed
- [ ] PM2 installed globally
- [ ] Nginx installed
- [ ] Git installed (if using Git deployment)

## Application Deployment
- [ ] Application code uploaded/cloned
- [ ] Dependencies installed (npm ci --only=production)
- [ ] Environment file created and configured
- [ ] Application built successfully (npm run build)
- [ ] PM2 configuration tested
- [ ] Application accessible on port 3000

## Nginx Configuration
- [ ] Nginx config file created
- [ ] Site enabled in Nginx
- [ ] Nginx configuration tested (nginx -t)
- [ ] Nginx restarted and enabled

## SSL & Security
- [ ] SSL certificate obtained (Let's Encrypt)
- [ ] HTTPS redirect working
- [ ] Security headers configured
- [ ] Firewall configured (UFW)
- [ ] Regular security updates scheduled

## Monitoring & Maintenance
- [ ] PM2 monitoring set up
- [ ] Log rotation configured
- [ ] Backup scripts created
- [ ] Monitoring alerts set up
- [ ] Update procedures documented

## DNS Configuration
- [ ] A record: yourdomain.com → VPS IP
- [ ] A record: www.yourdomain.com → VPS IP
- [ ] CNAME record: www → yourdomain.com (alternative)

## Final Testing
- [ ] Website loads correctly
- [ ] All pages accessible
- [ ] Forms working (contact, upload)
- [ ] Admin dashboard functional
- [ ] Mobile responsiveness verified
- [ ] SSL certificate valid
- [ ] Performance tested