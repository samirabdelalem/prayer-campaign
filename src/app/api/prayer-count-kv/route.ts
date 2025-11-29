import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Get the global prayer count from KV store
    const globalCount = await kv.get<number>('globalPrayerCount');
    const count = globalCount || 0;
    
    return NextResponse.json({
      success: true,
      globalCount: count,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting prayer count from KV:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get prayer count' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { increment = 1 } = body;

    // Atomically increment the global counter in KV store
    const newCount = await kv.incrby('globalPrayerCount', increment);
    
    return NextResponse.json({
      success: true,
      globalCount: newCount,
      increment: increment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error incrementing prayer count in KV:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment prayer count' },
      { status: 500 }
    );
  }
}

// Optional: Reset endpoint for admin use
export async function DELETE() {
  try {
    await kv.set('globalPrayerCount', 0);
    
    return NextResponse.json({
      success: true,
      message: 'Prayer count reset successfully',
      globalCount: 0
    });
  } catch (error) {
    console.error('Error resetting prayer count in KV:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset prayer count' },
      { status: 500 }
    );
  }
}