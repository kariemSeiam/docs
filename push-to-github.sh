#!/bin/bash

echo "Push to GitHub - YouTube Transcript Extractor"
echo "============================================"
echo ""

# Check if username is provided as argument
if [ $# -eq 0 ]; then
    read -p "Enter your GitHub username: " GITHUB_USERNAME
else
    GITHUB_USERNAME=$1
fi

# Repository name is workspace
REPO_NAME="workspace"

echo ""
echo "Setting up remote for: https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Remove existing origin if exists
git remote remove origin 2>/dev/null

# Add the remote
git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Push complete!"
echo ""
echo "Your site will be available at: https://$GITHUB_USERNAME.github.io/$REPO_NAME/"
echo ""
echo "Next steps:"
echo "1. Go to https://github.com/$GITHUB_USERNAME/$REPO_NAME/settings/pages"
echo "2. Under 'Build and deployment', select 'GitHub Actions' as source"
echo "3. The deployment will start automatically"
echo "4. Check Actions tab to monitor progress"