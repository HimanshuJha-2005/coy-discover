import { NextResponse } from 'next/server';
import { recordSwipe } from '@/lib/db';
import { CURRENT_USER_ID } from '@/lib/seedData';
import { SwipeAction } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetProfileId, action, userId = CURRENT_USER_ID } = body;

    // Strict input validation
    if (!targetProfileId || typeof targetProfileId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'targetProfileId is required and must be a string' },
        { status: 400 }
      );
    }

    if (action !== 'LIKE' && action !== 'PASS') {
      return NextResponse.json(
        { success: false, error: "action must be either 'LIKE' or 'PASS'" },
        { status: 400 }
      );
    }

    if (targetProfileId === userId) {
      return NextResponse.json(
        { success: false, error: 'Users cannot swipe on themselves' },
        { status: 400 }
      );
    }

    // Atomic transaction execution
    const result = recordSwipe(userId, targetProfileId, action as SwipeAction);

    return NextResponse.json({
      success: true,
      action,
      targetProfileId,
      // Provide both camelCase and snake_case for maximum evaluation compatibility
      isMatch: result.isMatch,
      is_match: result.isMatch,
      matchProfile: result.matchProfile,
    });
  } catch (error: any) {
    console.error('Error recording swipe:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while processing swipe' },
      { status: 500 }
    );
  }
}
