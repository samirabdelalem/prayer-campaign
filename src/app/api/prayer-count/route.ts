import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for demo (في التطبيق الحقيقي نستخدم قاعدة بيانات)
let globalPrayerCount = 0;
let lastResetDate = new Date().toDateString();

// Reset daily count if needed
const checkAndResetDaily = () => {
  const today = new Date().toDateString();
  if (lastResetDate !== today) {
    // في التطبيق الحقيقي، يمكن إضافة عداد يومي منفصل
    lastResetDate = today;
  }
};

export async function GET() {
  try {
    checkAndResetDaily();
    
    return NextResponse.json({
      success: true,
      globalCount: globalPrayerCount,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting prayer count:', error);
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

    checkAndResetDaily();
    
    // Increment the global counter
    globalPrayerCount += increment;
    
    return NextResponse.json({
      success: true,
      globalCount: globalPrayerCount,
      increment: increment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error incrementing prayer count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to increment prayer count' },
      { status: 500 }
    );
  }
}

// Optional: Reset endpoint for admin use
export async function DELETE() {
  try {
    globalPrayerCount = 0;
    lastResetDate = new Date().toDateString();
    
    return NextResponse.json({
      success: true,
      message: 'Prayer count reset successfully',
      globalCount: globalPrayerCount
    });
  } catch (error) {
    console.error('Error resetting prayer count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset prayer count' },
      { status: 500 }
    );
  }
}