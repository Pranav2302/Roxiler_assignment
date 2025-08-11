# Store Rating System - Deployment Guide

## 🚀 Vercel Deployment

### Backend Deployment

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Add Vercel configuration"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `backend` folder as the root directory
   - Add environment variables:
     - `DATABASE_URL`: Your Supabase connection string
     - `JWT_SECRET`: Your JWT secret key
     - `NODE_ENV`: production

3. **Configure Environment Variables in Vercel**
   ```
   DATABASE_URL = postgresql://postgres.qfhuqphvqknqupzkvdno:Pranav@123@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   JWT_SECRET = Pranavkamble
   NODE_ENV = production
   ```

### Frontend Deployment

1. **Update API Base URL**
   - Update `frontend/src/utils/api.js`
   - Change `API_BASE` to your deployed backend URL
   
2. **Deploy Frontend**
   - Create a new Vercel project for frontend
   - Select the `frontend` folder as root directory
   - Deploy automatically

### Environment Variables Required

#### Backend (.env)
```
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=production
```

#### Frontend
No environment variables needed, but update API_BASE in api.js

### Post-Deployment Steps

1. **Test all endpoints**
2. **Verify database connection**
3. **Test user authentication**
4. **Check CORS settings**

### Troubleshooting

- **500 Error**: Check environment variables
- **Database Error**: Verify Supabase connection
- **CORS Error**: Update CORS configuration in backend
- **Build Error**: Check package.json scripts

## 📱 Live URLs

- **Backend**: `https://your-backend.vercel.app`
- **Frontend**: `https://your-frontend.vercel.app`
