export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  bio: string;
  cityOrCollege: string;
  interests: string[];
}

export type SwipeAction = 'LIKE' | 'PASS';

export interface Swipe {
  id: number;
  userId: string;
  targetProfileId: string;
  action: SwipeAction;
  createdAt: string;
}

export interface Match {
  id: number;
  profile: Profile;
  matchedAt: string;
}

export interface SwipeResponse {
  success: boolean;
  isMatch: boolean;
  matchProfile?: Profile;
  remainingCount?: number;
}
