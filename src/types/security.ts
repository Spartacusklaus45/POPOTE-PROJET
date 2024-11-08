export interface SecurityLog {
  id: string;
  event: string;
  severity: 'low' | 'medium' | 'high';
  ip: string;
  userId?: string;
  timestamp: string;
  details?: Record<string, any>;
}

export interface LoginAttempt {
  id: string;
  userId?: string;
  email: string;
  ip: string;
  userAgent: string;
  success: boolean;
  timestamp: string;
  failureReason?: string;
}

export interface BlockedAccount {
  id: string;
  userId: string;
  email: string;
  reason: string;
  blockedAt: string;
  blockedBy: string;
  attempts: LoginAttempt[];
}

export interface SecuritySettings {
  maxLoginAttempts: number;
  loginLockoutDuration: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  requireNumbers: boolean;
  requireUppercase: boolean;
  sessionTimeout: number;
  twoFactorEnabled: boolean;
  allowedIPs: string[];
}