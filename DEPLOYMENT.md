# Deployment Guide - Railway

## 🚀 Deploy Smart Schedule to Railway

Railway is the recommended platform for this full-stack app. It handles both the Node.js backend and static frontend with automatic deployments from GitHub.

### Prerequisites
- GitHub account (for code hosting)
- Railway account (free at railway.app)
- Git installed locally

---

## Step 1: Prepare for Production

### 1.1 Build the Frontend
```bash
cd frontend
npm run build
cd ..
```

This creates a `frontend/dist` folder with optimized static files.

### 1.2 Create .env File
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=production
DATABASE_URL=./tasks.db
```

### 1.3 Verify package.json Scripts
Make sure your root `package.json` has:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "cd frontend && npm install && npm run build",
    "dev": "node server.js"
  }
}
```

---

## Step 2: Push to GitHub

### 2.1 Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial Monday.com Clone deployment"
```

### 2.2 Create GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Create a new repository (e.g., `monday-clone`)
3. Follow the instructions to push your local code:

```bash
git remote add origin https://github.com/YOUR_USERNAME/monday-clone.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Railway

### 3.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Authorize GitHub and select your `monday-clone` repository
5. Click "Deploy"

### 3.2 Add Environment Variables
1. Go to your project on Railway
2. Click "Variables"
3. Add:
   ```
   PORT=5000
   NODE_ENV=production
   ```

### 3.3 Wait for Deployment
Railway will automatically:
- Build your Node.js backend
- Build your React frontend
- Deploy everything
- Assign a URL (e.g., `monday-clone.up.railway.app`)

---

## Step 4: Verify Deployment

Once Railway shows "✓ Success":

1. **Test Backend API**:
   ```bash
   curl https://your-railway-url.up.railway.app/api/projects
   ```

2. **Test Frontend**:
   Open `https://your-railway-url.up.railway.app` in your browser

3. **Test Full Flow**:
   - Create a project
   - Create a board
   - Add tasks
   - Switch between views
   - Edit tasks

---

## Step 5: Connect Custom Domain (Optional)

If you have a domain:

1. Go to Railway project → Settings → Domains
2. Add your custom domain
3. Update DNS records with Railway's values
4. Wait for DNS to propagate (5-30 minutes)

---

## 📊 Monitoring

### View Logs
```
Railway Dashboard → Logs → View real-time logs
```

### Common Issues

**Database file not persisting?**
- Railway's filesystem is ephemeral by default
- Use Railway's PostgreSQL add-on instead:
  1. Go to "Add Services"
  2. Select "PostgreSQL"
  3. Update connection string in code

**High memory usage?**
- Frontend build is cached
- API responses are optimized
- Check logs for errors

### Performance Tips
1. Enable Railway's auto-scale (Settings → Scaling)
2. Monitor response times in Railway dashboard
3. Set up alerts for failures
4. Cache static assets with CDN (optional)

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Feature: add X"
git push origin main

# Railway automatically rebuilds and deploys
```

---

## 🗄️ Database Backup

### Backup SQLite Database
```bash
# Download from Railway
railway download tasks.db

# Or via Railway CLI
railway run cat tasks.db > backup.db
```

### Upgrade to PostgreSQL
For production reliability, consider upgrading:

1. Add PostgreSQL from Railway services
2. Update connection string
3. Migrate data
4. Test thoroughly

---

## 🚨 Troubleshooting

**App won't start**
- Check Railway logs
- Verify Node version compatibility
- Ensure all dependencies installed

**API returns 502/503**
- Check backend logs
- Verify database connection
- Check memory/CPU limits

**Frontend shows blank page**
- Check network tab for 404s
- Verify `frontend/dist` was built
- Clear browser cache

**Database issues**
- Use Railway PostgreSQL instead of file-based
- Set up automated backups
- Monitor disk space

---

## 🎯 Your Live App

Once deployed, you'll have:
- **Frontend**: `https://your-railway-url.up.railway.app`
- **API**: `https://your-railway-url.up.railway.app/api/*`
- **Admin Panel**: Railway dashboard for monitoring
- **Automatic Deployments**: On every GitHub push

---

## 📈 Next Steps After Deployment

1. **Enable HTTPS** - Railway handles automatically
2. **Set up monitoring** - Enable alerts in Railway
3. **Database backups** - Use Railway's backup service
4. **Add custom domain** - Connect your domain
5. **Monitor performance** - Track metrics in dashboard

---

## Support

- Railway Docs: https://docs.railway.app
- GitHub Integration: https://docs.railway.app/deploy/github
- Troubleshooting: https://docs.railway.app/troubleshoot
