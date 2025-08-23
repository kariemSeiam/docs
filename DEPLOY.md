# Deployment Guide - GitHub Pages

This guide will help you deploy the YouTube Transcript Extractor to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed locally
- The project built and committed locally (already done)

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository: `youtube-transcript-extractor`
4. Make it public (required for free GitHub Pages hosting)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/youtube-transcript-extractor.git

# Push to GitHub
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## Step 3: Configure GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Build and deployment":
   - Source: Select "GitHub Actions"
   - This will use our workflow file

## Step 4: Trigger the Deployment

The deployment will automatically trigger when you push to the main branch. You can also manually trigger it:

1. Go to the "Actions" tab in your repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow" > "Run workflow"

## Step 5: Access Your Site

After the workflow completes (usually takes 2-5 minutes):

1. Go back to Settings > Pages
2. You'll see a message: "Your site is live at https://YOUR_USERNAME.github.io/youtube-transcript-extractor/"
3. Click the link to view your deployed site!

## Updating the Site

Any time you push changes to the main branch, the site will automatically redeploy:

```bash
git add .
git commit -m "Your update message"
git push
```

## Troubleshooting

### Build Fails
- Check the Actions tab for error messages
- Ensure all dependencies are properly listed in package.json
- Make sure the Next.js config is set for static export

### 404 Error
- Wait a few minutes for GitHub Pages to propagate
- Check that the base path in next.config.js matches your repository name
- Ensure the workflow completed successfully

### CORS Issues
- The demo uses mock data to avoid CORS issues
- For production, implement a proper backend API

## Custom Domain (Optional)

To use a custom domain:

1. Go to Settings > Pages
2. Under "Custom domain", enter your domain
3. Follow GitHub's instructions for DNS configuration

## Important Notes

1. **API Limitations**: The current implementation uses mock data for demonstration. For a production app, you'll need:
   - A backend server to handle YouTube API calls
   - Proper API keys and authentication
   - CORS proxy or backend endpoints

2. **GitHub Pages Limitations**:
   - Only static sites (no server-side rendering)
   - No environment variables (don't commit API keys!)
   - Public repositories only for free hosting

3. **Performance**: 
   - First load might be slow due to GitHub Pages CDN
   - Subsequent visits will be faster due to caching

## Next Steps

1. Implement a proper backend for YouTube transcript extraction
2. Add error handling for failed transcript fetches
3. Implement user authentication if needed
4. Consider using Vercel or Netlify for more features

Happy deploying! 🚀