import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Record log-Instrumentation
const logEvent = (msg: string) => {
  console.log(`[Test API] ${msg} at ${new Date().toISOString()}`);
};

export async function GET() {
  logEvent('Received GET /api/test');

  try {
    const start = Date.now();
    await prisma.user.findMany(); // Test database connection
    const duration = Date.now() - start;

    logEvent(`Database test success (${duration}ms)`);

    return NextResponse.json({
      success: true,
      message: 'Database connection OK',
      duration: `${duration}ms`,
    });
  } catch (error: any) {
    logEvent(`Database test failed: ${error.message}`);
    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}