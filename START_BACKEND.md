# How to Start the Backend Server

## Prerequisites
1. Make sure MongoDB is running
2. Create a `.env` file in `hieq-admin-backend` folder with:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=4000
   ```

## Start the Backend Server

### Option 1: Development Mode (with auto-reload)
```bash
cd hieq-admin-backend
npm run dev
```

### Option 2: Production Mode
```bash
cd hieq-admin-backend
npm start
```

## Verify Backend is Running
1. Open browser and go to: `http://localhost:4000/api/health`
2. You should see: `{"ok":true,"ts":...}`

## Troubleshooting
- If port 4000 is already in use, change PORT in `.env` file
- Make sure MongoDB connection string is correct
- Check console for any error messages

