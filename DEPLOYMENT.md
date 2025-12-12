# Deployment Guide

This guide covers deploying the Employee Appraisal System to various platforms.

## 🚀 Vercel (Recommended)

### Prerequisites
- GitHub repository
- Vercel account
- Supabase project

### Steps
1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings

3. **Environment Variables**
   Add these in Vercel dashboard:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Visit your deployment URL

### Custom Domain (Optional)
1. Add domain in Vercel dashboard
2. Configure DNS records
3. SSL certificate is automatic

## 🌐 Netlify

### Steps
1. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`

2. **Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Deploy automatically

## 🚂 Railway

### Steps
1. **Connect Repository**
   - Link GitHub repository
   - Railway detects Next.js automatically

2. **Environment Variables**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   ```

3. **Deploy**
   - Railway builds and deploys automatically
   - Custom domain available

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

### Commands
```bash
# Build image
docker build -t employee-appraisal-system .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  employee-appraisal-system

# Using Docker Compose
docker-compose up -d
```

## ☁️ AWS Deployment

### Using AWS Amplify
1. **Connect Repository**
   - Link GitHub repository
   - Configure build settings

2. **Build Settings**
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```

3. **Environment Variables**
   - Add in Amplify console
   - Same variables as other platforms

### Using EC2 + PM2
1. **Setup EC2 Instance**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone your-repo-url
   cd employee-appraisal-system

   # Install dependencies
   npm ci

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "appraisal-system" -- start
   pm2 save
   pm2 startup
   ```

## 🔧 Environment Configuration

### Required Variables
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Optional Variables
```env
NODE_ENV=production
PORT=3000
```

## 📊 Database Setup

### Supabase Configuration
1. **Create Project**
   - Visit [supabase.com](https://supabase.com)
   - Create new project
   - Note URL and anon key

2. **Run Migrations**
   - Execute `supabase-setup.sql`
   - Execute `supabase-experience-update.sql`
   - Verify tables are created

3. **Configure RLS**
   - Policies are included in SQL files
   - Test with demo users

## 🔍 Health Checks

### Monitoring
- Set up uptime monitoring
- Configure error tracking (Sentry)
- Monitor database performance

### Testing Deployment
1. **Functionality Tests**
   - User registration/login
   - Appraisal submission
   - Manager reviews
   - Data persistence

2. **Performance Tests**
   - Page load times
   - Database query performance
   - Mobile responsiveness

## 🚨 Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version (18+)
   - Verify environment variables
   - Review build logs

2. **Database Connection**
   - Verify Supabase URL/key
   - Check network connectivity
   - Review RLS policies

3. **Authentication Issues**
   - Confirm environment variables
   - Check Supabase configuration
   - Verify demo credentials

### Support
- Check deployment platform docs
- Review application logs
- Test locally first

---

Choose the deployment method that best fits your needs and infrastructure requirements!