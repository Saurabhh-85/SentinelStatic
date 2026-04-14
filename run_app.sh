#!/bin/bash

# Function to kill background processes on exit
cleanup() {
    echo "Stopping services..."
    kill $(jobs -p)
    exit
}

trap cleanup SIGINT

echo "🚀 Starting SentinelStatic Backend..."
# Run backend in background
python3 api.py &

echo "🚀 Starting SentinelStatic Frontend..."
# Run frontend
cd frontend
npm run dev
