import { NextResponse } from 'next/server';
import { getMatches } from '@/lib/db';
import { CURRENT_USER_ID } from '@/lib/seedData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || CURRENT_USER_ID;

    const matches = getMatches(userId);

    return NextResponse.json({
      success: true,
      count: matches.length,
      matches,
    });
  } catch (error: any) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching matches' },
      { status: 500 }
    );
  }
}
