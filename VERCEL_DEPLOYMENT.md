# 🚀 Vercel Deployment Guide

This guide will walk you through deploying your Christmas HQ app to Vercel.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com) - free tier is fine)
- Your Supabase project already set up
- Git repository (GitHub, GitLab, or Bitbucket)

## Step 1: Push Your Code to Git

If you haven't already, make sure your code is in a Git repository:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for first time)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository (GitHub/GitLab/Bitbucket)
4. Vercel will auto-detect it's a Vite project
5. **Don't click Deploy yet!** First, we need to add environment variables

### Option B: Deploy via CLI

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow the prompts)
vercel

# For production deployment
vercel --prod
```

## Step 3: Add Environment Variables in Vercel

**⚠️ IMPORTANT: Do this BEFORE your first deployment!**

1. In the Vercel project setup page, scroll down to **"Environment Variables"**
2. Click **"Add"** and add these two variables:

   **Variable 1:**
   - **Name:** `VITE_SUPABASE_URL`
   - **Value:** Your Supabase project URL (e.g., `https://xxxxx.supabase.co`)
   - **Environment:** Select all (Production, Preview, Development)

   **Variable 2:**
   - **Name:** `VITE_SUPABASE_ANON_KEY`
   - **Value:** Your Supabase anonymous key
   - **Environment:** Select all (Production, Preview, Development)

3. Click **"Save"** after adding each variable

### Where to Find Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. You'll find:
   - **Project URL** → Use for `VITE_SUPABASE_URL`
   - **anon/public key** → Use for `VITE_SUPABASE_ANON_KEY`

## Step 4: Deploy!

1. After adding environment variables, click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your app will be live at a URL like: `https://your-project.vercel.app`

## Step 5: Update Environment Variables Later

If you need to update environment variables after deployment:

### Via Dashboard:
1. Go to your project on Vercel
2. Click **Settings** → **Environment Variables**
3. Edit or add variables
4. **Important:** After updating, redeploy your app:
   - Go to **Deployments** tab
   - Click the **"..."** menu on the latest deployment
   - Click **"Redeploy"**

### Via CLI:
```bash
# Add a variable
vercel env add VITE_SUPABASE_URL

# List all variables
vercel env ls

# Pull variables to local .env
vercel env pull .env
```

## 🔒 Security: Is It Safe?

### ✅ YES, It's Safe!

**The Supabase Anon Key is designed to be public:**

1. **Row Level Security (RLS)**: Your Supabase database uses RLS policies to protect data. The anon key can only access what your policies allow.

2. **Frontend Exposure**: Since this is a Vite app (client-side), all environment variables prefixed with `VITE_` are bundled into your JavaScript and visible in the browser. This is **expected and safe** for Supabase anon keys.

3. **What's Protected:**
   - ✅ Your database is protected by RLS policies
   - ✅ User authentication is handled securely by Supabase
   - ✅ Only authorized users can access/modify data based on your policies

4. **What You Should NEVER Expose:**
   - ❌ Supabase **service_role** key (this bypasses RLS - keep it secret!)
   - ❌ Any API keys that have admin privileges
   - ❌ Database passwords
   - ❌ Private keys or secrets

### Your Current Setup is Secure ✅

Your app only uses:
- `VITE_SUPABASE_URL` - Public project URL (safe)
- `VITE_SUPABASE_ANON_KEY` - Public anon key (safe, protected by RLS)

## Custom Domain (Optional)

1. Go to your project → **Settings** → **Domains**
2. Add your custom domain
3. Follow Vercel's DNS instructions
4. Vercel will automatically provision SSL certificates

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Make sure your `package.json` has the correct build script
- Check build logs in Vercel dashboard

### App Works Locally But Not on Vercel
- Verify environment variables are set correctly
- Make sure variables are enabled for the correct environment (Production/Preview)
- Redeploy after adding/updating variables

### Supabase Connection Issues
- Double-check your Supabase URL and anon key
- Verify your Supabase project is active
- Check Supabase dashboard for any service issues

## Continuous Deployment

Once connected to Git, Vercel will automatically:
- ✅ Deploy on every push to `main` branch
- ✅ Create preview deployments for pull requests
- ✅ Run builds automatically

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)

---

**🎉 You're all set! Your Christmas HQ app should now be live on Vercel!**
