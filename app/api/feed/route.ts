import { NextResponse } from 'next/server';
import { getFeed } from '@/lib/db';
import { CURRENT_USER_ID } from '@/lib/seedData';

// Dynamic route to ensure fresh feed data
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || CURRENT_USER_ID;

    // Strict Zero-Leak Privacy Invariant:
    // Profiles returned DO NOT include any inbound like information or flags
    const profiles = getFeed(userId);

    return NextResponse.json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while fetching feed' },
      { status: 500 }
    );
  }
}
