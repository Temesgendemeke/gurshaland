import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const envCheck = {
      GEMINI_API_KEY: {
        exists: !!process.env.GEMINI_API_KEY,
        length: process.env.GEMINI_API_KEY?.length || 0,
        startsWith: process.env.GEMINI_API_KEY?.substring(0, 10) + '...' || 'N/A'
      },
      PIXELS_API_KEY: {
        exists: !!process.env.PIXELS_API_KEY,
        length: process.env.PIXELS_API_KEY?.length || 0,
        startsWith: process.env.PIXELS_API_KEY?.substring(0, 10) + '...' || 'N/A'
      },
      NODE_ENV: process.env.NODE_ENV,
      REDIS_URL: {
        exists: !!process.env.REDIS_URL,
        value: process.env.REDIS_URL || 'N/A'
      }
    };

    return NextResponse.json({
      status: 'success',
      environment: envCheck,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Environment check failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}