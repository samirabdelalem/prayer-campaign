import { NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    // Test KV connection by setting and getting a value
    await kv.set('test-key', 'Hello from Vercel KV!');
    const value = await kv.get('test-key');
    
    return NextResponse.json({
      success: true,
      message: 'KV connection successful',
      value: value
    });
  } catch (error) {
    console.error('KV Test Error:', error);
    return NextResponse.json(
      { success: false, error: 'KV connection failed' },
      { status: 500 }
    );
  }
}