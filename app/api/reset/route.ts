import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    resetDatabase();
    return NextResponse.json({
      success: true,
      message: 'Demo state reset successfully. All profiles restored and ready to swipe.',
    });
  } catch (error: any) {
    console.error('Error resetting database:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while resetting database' },
      { status: 500 }
    );
  }
}
