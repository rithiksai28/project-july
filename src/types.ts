export interface Student {
  id: string;
  name: string;
  avatarUrl: string;
  attendance: number;
  predicted: number;
  riskLevel: 'Safe' | 'Warning' | 'Critical';
  className: string;
}

export type TabName = 'Dashboard' | 'Predictions' | 'Students' | 'Reports' | 'Settings';

export interface DerivedStats {
  total: number;
  safe: number;
  warning: number;
  critical: number;
}
