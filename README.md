Real-Time Bus Ticketing

Setup (local dev)
1. Create .env per .env.example
2. Start backend:
   cd backend
   npm install
   npm run dev
3. Start frontend:
   cd frontend
   npm install
   npm start

Production (docker)
1. Build image:
   docker build -t rt-ticketing:latest .
2. Run:
   docker run -p 4000:4000 --env-file .env rt-ticketing:latest

Usage
1. Open http://localhost:4000
2. Click "Create Demo Trip"
3. Click seats to select, Hold Selected, then Checkout
4. Watch seat status update in real-time (open multiple browser windows)