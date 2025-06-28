# Deployment Guide for Status Page App

## Prerequisites

Before deploying, make sure you have:
1. A database (PostgreSQL recommended for production)
2. Clerk account and API keys
3. Git repository (GitHub, GitLab, etc.)

## Option 1: Vercel (Recommended)

### Step 1: Prepare Your Database
- Use [Neon](https://neon.tech) (free PostgreSQL) or [Supabase](https://supabase.com) (free tier)
- Get your database connection string

### Step 2: Set Up Clerk
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy your publishable key and secret key

### Step 3: Deploy to Vercel
```bash
# Login to Vercel
vercel login

# Deploy (this will guide you through setup)
vercel

# For production deployment
vercel --prod
```

### Step 4: Configure Environment Variables
In Vercel dashboard, go to your project settings and add:
- `DATABASE_URL`: Your database connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `CLERK_SECRET_KEY`: Your Clerk secret key

### Step 5: Run Database Migrations
```bash
# Connect to your production database and run migrations
npx prisma migrate deploy
```

## Option 2: Netlify

### Step 1: Create netlify.toml
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

## Option 3: Railway

### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

### Step 2: Deploy
```bash
# Login to Railway
railway login

# Initialize and deploy
railway init
railway up
```

### Step 3: Add Environment Variables
```bash
railway variables set DATABASE_URL=your_database_url
railway variables set NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
railway variables set CLERK_SECRET_KEY=your_clerk_secret
```

## Option 4: Render

### Step 1: Create render.yaml
```yaml
services:
  - type: web
    name: statuspage
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        sync: false
      - key: CLERK_SECRET_KEY
        sync: false
```

### Step 2: Deploy
1. Connect your GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy

## Database Setup

### For Production Database:
1. **Neon** (Recommended - Free PostgreSQL):
   - Sign up at https://neon.tech
   - Create a new project
   - Copy the connection string
   - Use it as your `DATABASE_URL`

2. **Supabase** (Free tier):
   - Sign up at https://supabase.com
   - Create a new project
   - Go to Settings > Database
   - Copy the connection string

### Run Migrations:
```bash
# Update your .env file with production database URL
DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy
```

## Environment Variables Checklist

Make sure these are set in your hosting platform:

```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Post-Deployment Steps

1. **Test your application**: Visit your deployed URL
2. **Set up custom domain** (optional): Configure in your hosting platform
3. **Monitor logs**: Check for any errors in your hosting platform's dashboard
4. **Set up monitoring**: Consider adding error tracking (Sentry, etc.)

## Troubleshooting

### Common Issues:
1. **Database connection errors**: Check your `DATABASE_URL` format
2. **Clerk authentication issues**: Verify your Clerk keys are correct
3. **Build failures**: Check your hosting platform's build logs
4. **Environment variables**: Ensure all required variables are set

### Debug Commands:
```bash
# Check if your app builds locally
npm run build

# Test production build locally
npm start

# Check Prisma connection
npx prisma db push
```

## Free Hosting Comparison

| Platform | Free Tier | Database | SSL | Custom Domain |
|----------|-----------|----------|-----|---------------|
| Vercel | ✅ | ❌ | ✅ | ✅ |
| Netlify | ✅ | ❌ | ✅ | ✅ |
| Railway | ✅ | ✅ | ✅ | ❌ |
| Render | ✅ | ❌ | ✅ | ✅ |
| Fly.io | ✅ | ❌ | ✅ | ✅ |

**Recommendation**: Use **Vercel** + **Neon** for the best free setup! 