#!/bin/bash
# Script used for Railway

# Backend setup and start
cd backend
npm install
npm run build
npm run db:push || true  # Run migration (non-blocking if it fails)
node dist/index.js &
BACKEND_PID=$!

# Frontend setup and build
cd ../frontend
npm install
npm run build

# Start frontend server (using serve as static server)
cd dist
npx serve . -l 3000 &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID