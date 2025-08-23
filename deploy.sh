#!/bin/bash

echo "YouTube Transcript Extractor - GitHub Pages Deployment Script"
echo "==========================================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Error: Git is not initialized in this directory."
    echo "Run 'git init' first."
    exit 1
fi

# Check if there are uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "You have uncommitted changes. Committing them now..."
    git add .
    read -p "Enter commit message: " commit_msg
    git commit -m "$commit_msg"
fi

# Check if remote is set
if ! git remote | grep -q "origin"; then
    echo "No remote repository set."
    read -p "Enter your GitHub username: " username
    read -p "Enter repository name (default: youtube-transcript-extractor): " repo_name
    repo_name=${repo_name:-youtube-transcript-extractor}
    
    git remote add origin "https://github.com/$username/$repo_name.git"
    echo "Remote added: https://github.com/$username/$repo_name.git"
fi

echo ""
echo "Ready to push to GitHub!"
echo "Make sure you have:"
echo "1. Created the repository on GitHub"
echo "2. Set it to public (required for free GitHub Pages)"
echo ""
read -p "Continue with push? (y/n): " confirm

if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
    echo "Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Push complete!"
    echo ""
    echo "Next steps:"
    echo "1. Go to your repository on GitHub"
    echo "2. Navigate to Settings > Pages"
    echo "3. Under 'Build and deployment', select 'GitHub Actions' as the source"
    echo "4. The deployment will start automatically"
    echo "5. Your site will be available at: https://$username.github.io/$repo_name/"
    echo ""
    echo "Check the Actions tab in your repository to monitor the deployment progress."
else
    echo "Push cancelled."
fi