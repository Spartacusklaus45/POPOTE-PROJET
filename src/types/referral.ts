export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  code: string;
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED';
  rewardAmount: number;
  rewardClaimed: boolean;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  completedAt?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  availableRewards: number;
  referralCode: string;
}