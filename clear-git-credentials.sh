#!/bin/bash
# Script to clear GitHub credentials from macOS Keychain

echo "Clearing GitHub credentials from Keychain..."
security delete-internet-password -s github.com 2>/dev/null
echo "✅ Credentials cleared!"
echo ""
echo "Now when you push, Git will ask for:"
echo "  Username: Henrohq"
echo "  Password: [your Personal Access Token]"
