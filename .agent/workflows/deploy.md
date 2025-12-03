---
description: Deployment workflow for Antigravity Demo
---

# Antigravity Demo - Deployment Workflow

Step-by-step guide to build and deploy the Antigravity Demo application.

## Local Preview Build

### 1. Build for Production

Create optimized production build:

// turbo
```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Bundle and minify all assets
- Optimize for production performance
- Output to `dist/` directory

### 2. Preview Production Build

Test the production build locally:

// turbo
```bash
npm run preview
```

The preview server will start (typically on http://localhost:4173).
Test all functionality in production mode before deploying.

## Deployment Options

### Option 1: Firebase Hosting

1. Install Firebase CLI (if not installed):

```bash
npm install -g firebase-tools
```

2. Login to Firebase:

```bash
firebase login
```

3. Initialize Firebase Hosting:

```bash
firebase init hosting
```

Configuration:
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: Optional

4. Deploy:

```bash
firebase deploy --only hosting
```

### Option 2: Vercel

1. Install Vercel CLI:

```bash
npm install -g vercel
```

2. Deploy:

```bash
vercel
```

Follow the prompts to configure your project.

### Option 3: Netlify

1. Build the project:

```bash
npm run build
```

2. Drag and drop the `dist/` folder to Netlify's deploy dropzone at https://app.netlify.com/drop

Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 4: GitHub Pages

1. Install gh-pages:

```bash
npm install --save-dev gh-pages
```

2. Add deploy script to package.json:

```json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}
```

3. Deploy:

```bash
npm run deploy
```

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Environment variables configured (if any)
- [ ] Build completes without warnings
- [ ] Preview build works correctly
- [ ] Performance optimizations applied
- [ ] SEO meta tags configured (in index.html)

## Post-Deployment Verification

After deploying, verify:

1. Site loads at deployed URL
2. All assets load correctly (no 404s)
3. Theme toggle works
4. Counter functionality works
5. Particle animations perform well
6. Mobile responsiveness intact
7. All links and navigation work

## Rollback Procedure

If issues are discovered after deployment:

### Firebase
```bash
firebase hosting:rollback
```

### Vercel
Access Vercel dashboard → Select deployment → Rollback

### Netlify
Access Netlify dashboard → Deploys → Restore previous deploy

## Continuous Deployment

For automatic deployments on git push:

1. **GitHub Actions**: Create `.github/workflows/deploy.yml`
2. **Vercel**: Connect GitHub repository in Vercel dashboard
3. **Netlify**: Connect GitHub repository in Netlify dashboard

This enables automatic rebuilds and deployments on every push to main branch.
