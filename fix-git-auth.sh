#!/bin/bash
# Fix Git authentication for Henrohq account

echo "🔧 Fixing Git authentication for Henrohq account..."
echo ""

# Clear stored credentials
if [ -f ~/.git-credentials ]; then
    echo "Clearing old GitHub credentials from ~/.git-credentials..."
    grep -v "github.com" ~/.git-credentials > ~/.git-credentials.tmp && mv ~/.git-credentials.tmp ~/.git-credentials
    echo "✅ Cleared!"
else
    echo "No ~/.git-credentials file found"
fi

# Update remote URL to include username
echo ""
echo "Updating remote URL to use Henrohq username..."
cd /Users/henryramirez/Documents/Projects/christmas-hq
git remote set-url origin https://Henrohq@github.com/Henrohq/christmas-hq.git

echo ""
echo "✅ Done! Now try pushing:"
echo "   git push -u origin main"
echo ""
echo "When prompted:"
echo "   Username: Henrohq"
echo "   Password: [your Personal Access Token]"

