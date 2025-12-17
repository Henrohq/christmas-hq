# 🔧 Git & GitHub Setup Guide

## Current Git Configuration

Your current Git is configured with:
- **Name:** ramhen
- **Email:** henryaleraga@gmail.com

## Step 1: Choose Your GitHub Account

You mentioned you have 2 Git accounts. Let's make sure we're using the right one for this project.

### Option A: Use Current Account (ramhen / henryaleraga@gmail.com)
If this is correct, skip to Step 2.

### Option B: Switch to Different Account
If you need to use a different account for this project, run:

```bash
# Set local config for this project only (recommended)
git config user.name "YourOtherUsername"
git config user.email "your-other-email@example.com"

# Or set globally (affects all repos)
git config --global user.name "YourOtherUsername"
git config --global user.email "your-other-email@example.com"
```

## Step 2: Create GitHub Repository

1. **Go to GitHub:**
   - Sign in to the account you want to use
   - Go to [github.com/new](https://github.com/new)

2. **Create New Repository:**
   - **Repository name:** `christmas-hq` (or any name you prefer)
   - **Description:** "Interactive 3D Christmas tree with user messages"
   - **Visibility:** Choose Public or Private
   - **⚠️ IMPORTANT:** Do NOT initialize with README, .gitignore, or license (we already have these)
   - Click **"Create repository"**

3. **Copy the repository URL:**
   - You'll see a page with setup instructions
   - Copy the HTTPS or SSH URL (e.g., `https://github.com/yourusername/christmas-hq.git`)

## Step 3: Connect Local Repo to GitHub

After creating the repo on GitHub, run these commands (replace with your actual repo URL):

```bash
cd /Users/henryramirez/Documents/Projects/christmas-hq

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Christmas HQ app"

# Add GitHub remote (replace with your actual URL)
git remote add origin https://github.com/YOUR_USERNAME/christmas-hq.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 4: Verify Connection

Check that everything is connected:

```bash
git remote -v
```

You should see your GitHub repository URL.

## Managing Multiple GitHub Accounts

If you need to switch between accounts frequently, here are some options:

### Method 1: Use SSH Keys with Different Accounts
1. Generate separate SSH keys for each account
2. Configure SSH config to use different keys per account
3. Use SSH URLs instead of HTTPS

### Method 2: Use GitHub CLI
```bash
# Install GitHub CLI
brew install gh

# Login to specific account
gh auth login

# This will help manage multiple accounts
```

### Method 3: Use Local Config Per Project
```bash
# In each project, set local config
git config user.name "Account1"
git config user.email "account1@email.com"
```

## Troubleshooting

### Authentication Issues
If you get authentication errors when pushing:

**For HTTPS:**
- GitHub now requires Personal Access Tokens instead of passwords
- Go to GitHub → Settings → Developer settings → Personal access tokens
- Generate a token with `repo` permissions
- Use the token as your password when pushing

**For SSH:**
- Make sure your SSH key is added to your GitHub account
- Test connection: `ssh -T git@github.com`

### Wrong Account Committed
If you committed with the wrong account:

```bash
# Fix the last commit's author
git commit --amend --author="Correct Name <correct@email.com>"

# Force push (only if you haven't pushed yet, or if it's your own repo)
git push --force
```

## Next Steps

Once your code is on GitHub:
1. ✅ Go to Vercel and import this repository
2. ✅ Add environment variables in Vercel
3. ✅ Deploy!

---

**Need help?** Check the commands below - I can help you run them!
