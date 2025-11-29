# Vercel KV Setup for Prayer Counter

This document explains how to set up Vercel KV for persistent storage of the global prayer counter.

## Prerequisites

1. A Vercel account
2. A deployed Next.js application on Vercel

## Setup Steps

### 1. Create a Vercel KV Store

1. Go to your Vercel dashboard
2. Navigate to the Storage tab
3. Click "Create" and select "KV"
4. Choose a region close to your users
5. Create the KV store

### 2. Configure Environment Variables

After creating the KV store, Vercel will provide you with environment variables. Add these to your project:

- `KV_URL`
- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`
- `KV_REST_API_READ_ONLY_TOKEN`

### 3. Enable KV Storage

Set the following environment variable to enable KV storage:

```
USE_KV_STORE=true
```

## How It Works

The application will automatically use Vercel KV when `USE_KV_STORE` is set to `true`. The KV store provides:

- Persistent storage that survives server restarts
- Atomic increment operations for accurate counting
- Global availability with low latency

## API Endpoints

The KV-based API is available at:
- `GET /api/prayer-count-kv` - Get current count
- `POST /api/prayer-count-kv` - Increment count
- `DELETE /api/prayer-count-kv` - Reset count (for admin use)

## Fallback Behavior

If KV is not available or there's an error, the application will fall back to:
- Local storage caching
- In-memory storage (when running locally)

This ensures the application continues to work even if KV is temporarily unavailable.

## Testing

You can test the KV connection by visiting `/api/kv-test` which will verify the connection and basic operations.