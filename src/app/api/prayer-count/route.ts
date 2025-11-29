import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// File path for storing the prayer count
const COUNT_FILE_PATH = path.join(process.cwd(), 'data', 'prayer-count.json');

// Initialize the count file if it doesn't exist
async function initializeCountFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    await fs.mkdir(dataDir, { recursive: true });
    
    try {
      await fs.access(COUNT_FILE_PATH);
    } catch {
      // File doesn't exist, create it with initial values
      const initialData = {
        globalCount: 0,
        lastResetDate: new Date().toDateString(),
        lastUpdated: new Date().toISOString()
      };
      await fs.writeFile(COUNT_FILE_PATH, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error initializing count file:', error);
  }
}

// Read the current count from file
async function readCountFromFile() {
  try {
    await initializeCountFile();
    const data = await fs.readFile(COUNT_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading count from file:', error);
    // Return default values if file read fails
    return {
      globalCount: 0,
      lastResetDate: new Date().toDateString(),
      lastUpdated: new Date().toISOString()
    };
  }
}

// Write the count to file
async function writeCountToFile(countData: any) {
  try {
    await initializeCountFile();
    await fs.writeFile(COUNT_FILE_PATH, JSON.stringify(countData, null, 2));
  } catch (error) {
    console.error('Error writing count to file:', error);
  }
}

// Reset daily count if needed
async function checkAndResetDaily(countData: any) {
  const today = new Date().toDateString();
  if (countData.lastResetDate !== today) {
    // In a real application, you could add a separate daily counter
    countData.lastResetDate = today;
    countData.lastUpdated = new Date().toISOString();
    await writeCountToFile(countData);
  }
  return countData;
}

export async function GET() {
  try {
    let countData = await readCountFromFile();
    countData = await checkAndResetDaily(countData);
    
    return NextResponse.json({
      success: true,
      globalCount: countData.globalCount,
      lastUpdated: countData.lastUpdated
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

    // Read current count
    let countData = await readCountFromFile();
    countData = await checkAndResetDaily(countData);
    
    // Increment the global counter
    countData.globalCount += increment;
    countData.lastUpdated = new Date().toISOString();
    
    // Save updated count
    await writeCountToFile(countData);
    
    return NextResponse.json({
      success: true,
      globalCount: countData.globalCount,
      increment: increment,
      timestamp: countData.lastUpdated
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
    const countData = {
      globalCount: 0,
      lastResetDate: new Date().toDateString(),
      lastUpdated: new Date().toISOString()
    };
    
    await writeCountToFile(countData);
    
    return NextResponse.json({
      success: true,
      message: 'Prayer count reset successfully',
      globalCount: countData.globalCount
    });
  } catch (error) {
    console.error('Error resetting prayer count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reset prayer count' },
      { status: 500 }
    );
  }
}