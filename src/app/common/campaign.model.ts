export interface Campaign {
  id: string;
  campaignName: string;
  keywords: string;
  campaignFund: number;
  city: string;
  radius: number;
  status: 'on' | 'off';
  createdAt: Date;
}

export interface AccountState {
  totalBudget: number;
  spentBudget: number;
}
