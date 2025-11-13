# Deployment Guide - Vercel

This guide will help you deploy your RemNote Clone to Vercel.

## Method 1: Deploy via GitHub (Recommended)

This is the easiest method as it provides automatic deployments on every push.

### Steps:

1. **Push your code to GitHub** (Already done!)
   - Your code is already on branch: `claude/remnote-clone-functional-011CV5vgwPSKRvZGxa9rTkrT`

2. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

3. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Select your GitHub repository: `LIGHTnik10/NoterTakerApp`
   - Click "Import"

4. **Configure the Project**
   - Framework Preset: **Vite** (should be auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)
   - Install Command: `npm install` (default)

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at a URL like: `https://noter-taker-app.vercel.app`

6. **Set Production Branch** (Optional)
   - After first deployment, go to Project Settings → Git
   - Set your main branch as the production branch
   - The current feature branch will be a preview deployment

## Method 2: Deploy via Vercel CLI (Local Machine)

If you want to deploy from your local machine:

### Steps:

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy to Production**
   ```bash
   vercel --prod
   ```

4. **Follow the Prompts**
   - Link to existing project or create new
   - Confirm settings
   - Wait for deployment to complete

## Method 3: Deploy via Vercel Dashboard (Direct Upload)

1. **Build your project locally**
   ```bash
   npm run build
   ```

2. **Go to Vercel Dashboard**
   - Visit [vercel.com/new](https://vercel.com/new)

3. **Deploy the `dist` folder**
   - Drag and drop the `dist` folder
   - Or upload it manually

## Configuration Files

The project includes a `vercel.json` configuration file with:
- Build command: `npm run build`
- Output directory: `dist`
- Framework: `vite`
- SPA routing support (rewrites all routes to index.html)

## Environment Variables

This app currently uses localStorage for data persistence, so no environment variables are needed. If you add backend services in the future, you can add them in:

Vercel Dashboard → Project → Settings → Environment Variables

## Custom Domain (Optional)

After deployment, you can add a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Follow DNS configuration instructions

## Automatic Deployments

Once connected to GitHub:
- **Production deployments**: Push to main branch
- **Preview deployments**: Push to any other branch or create PR
- Every commit triggers a new deployment
- Each PR gets a unique preview URL

## Monitoring Your Deployment

After deployment, you can monitor:
- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → [Select deployment] → Build Logs
- **Performance**: Vercel Dashboard → Speed Insights

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure `package.json` has correct build script
- Verify all dependencies are in `package.json`

### 404 on Routes
- The `vercel.json` file handles SPA routing
- All routes redirect to `index.html`

### App Not Loading
- Check browser console for errors
- Verify the build completed successfully
- Check that `dist` folder was generated

## Next Steps

After successful deployment:
1. Test the application thoroughly
2. Share the URL with users
3. Monitor for any issues
4. Set up custom domain if desired
5. Enable Vercel Analytics for insights

## Support

For issues:
- Vercel Documentation: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Project Repository: https://github.com/LIGHTnik10/NoterTakerApp
