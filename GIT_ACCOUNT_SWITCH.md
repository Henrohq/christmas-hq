# 🔄 Switching Between Git Accounts (Henrohq vs ramhen)

## Current Setup

✅ **This project (`christmas-hq`) is configured to use:**
- **Account:** Henrohq
- **Email:** henry@hqrentalsoftware.com
- **Repository:** https://github.com/Henrohq/christmas-hq

✅ **Your global/default account (for other projects):**
- **Account:** ramhen
- **Email:** henryaleraga@gmail.com

## The Problem: Authentication

Git is trying to use cached credentials from the `ramhen` account when pushing to `Henrohq`'s repository, causing a 403 permission error.

## Solution: Use Personal Access Token

GitHub no longer accepts passwords. You need a **Personal Access Token** for the `Henrohq` account.

### Step 1: Create Personal Access Token for Henrohq

1. **Sign in to GitHub as Henrohq:**
   - Go to [github.com](https://github.com) and sign in with the **Henrohq** account

2. **Create Token:**
   - Go to: **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - **Note:** Give it a name like "christmas-hq-project"
   - **Expiration:** Choose your preference (90 days, 1 year, or no expiration)
   - **Scopes:** Check `repo` (this gives full repository access)
   - Click **"Generate token"**
   - **⚠️ IMPORTANT:** Copy the token immediately! You won't see it again.

### Step 2: Use Token When Pushing

When you push, Git will ask for credentials. Use:

- **Username:** `Henrohq` (your GitHub username)
- **Password:** `[paste your Personal Access Token here]` (NOT your GitHub password)

### Step 3: Clear Cached Credentials (One-Time Fix)

Run this command to clear the wrong cached credentials:

```bash
cd /Users/henryramirez/Documents/Projects/christmas-hq

# Clear cached credentials for GitHub
git credential-osxkeychain erase <<EOF
host=github.com
protocol=https
EOF
```

Or manually:
1. Open **Keychain Access** app (search in Spotlight)
2. Search for "github.com"
3. Delete any entries related to GitHub
4. Try pushing again - it will ask for new credentials

### Step 4: Push Your Code

Now try pushing again:

```bash
cd /Users/henryramirez/Documents/Projects/christmas-hq
git add .
git commit -m "Initial commit: Christmas HQ app"
git push -u origin main
```

When prompted:
- **Username:** `Henrohq`
- **Password:** `[your Personal Access Token]`

## Alternative: Use SSH (More Secure, No Password Prompts)

If you want to avoid entering tokens every time, set up SSH:

### Option A: SSH Key for Henrohq Only

1. **Generate SSH key for Henrohq:**
   ```bash
   ssh-keygen -t ed25519 -C "henry@hqrentalsoftware.com" -f ~/.ssh/id_ed25519_henrohq
   ```

2. **Add to SSH config:**
   ```bash
   # Edit ~/.ssh/config
   nano ~/.ssh/config
   ```
   
   Add this:
   ```
   Host github-henrohq
     HostName github.com
     User git
     IdentityFile ~/.ssh/id_ed25519_henrohq
   ```

3. **Add public key to GitHub:**
   ```bash
   cat ~/.ssh/id_ed25519_henrohq.pub
   # Copy the output
   ```
   - Go to GitHub (as Henrohq) → Settings → SSH and GPG keys → New SSH key
   - Paste the key

4. **Update remote to use SSH:**
   ```bash
   cd /Users/henryramirez/Documents/Projects/christmas-hq
   git remote set-url origin git@github-henrohq:Henrohq/christmas-hq.git
   ```

5. **Test and push:**
   ```bash
   ssh -T git@github-henrohq
   git push -u origin main
   ```

## Quick Reference

### Check Current Account for This Project
```bash
cd /Users/henryramirez/Documents/Projects/christmas-hq
git config --local user.name
git config --local user.email
```

### Change Account for This Project (if needed)
```bash
cd /Users/henryramirez/Documents/Projects/christmas-hq
git config --local user.name "Henrohq"
git config --local user.email "henry@hqrentalsoftware.com"
```

### Check Global Account (for other projects)
```bash
git config --global user.name
git config --global user.email
```

## Summary

- ✅ This project uses **Henrohq** account (local config)
- ✅ Other projects use **ramhen** account (global config)
- 🔑 Use **Personal Access Token** when pushing (or set up SSH)
- 🗑️ Clear cached credentials if you get 403 errors

---

**Recommended:** Use the Personal Access Token method first (easiest). If you push frequently, consider setting up SSH for convenience.
