import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { Campaign } from './campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly STORAGE_KEY = 'campaigns_data';
  private readonly BUDGET_KEY = 'account_budget';

  private campaigns$ = new BehaviorSubject<Campaign[]>(this.loadCampaigns());
  private totalBudget$ = new BehaviorSubject<number>(this.loadBudget());

  getCampaigns(): Observable<Campaign[]> {
    return this.campaigns$.asObservable();
  }

  getTotalBudget(): Observable<number> {
    return this.totalBudget$.asObservable();
  }

  getSpentBudget(): Observable<number> {
    return this.campaigns$.pipe(
      map(campaigns => campaigns.reduce((sum, c) => sum + c.campaignFund, 0))
    );
  }

  getAvailableBudget(): Observable<number> {
    return combineLatest([this.totalBudget$, this.getSpentBudget()]).pipe(
      map(([total, spent]) => total - spent)
    );
  }

  setTotalBudget(amount: number): void {
    this.totalBudget$.next(amount);
    localStorage.setItem(this.BUDGET_KEY, JSON.stringify(amount));
  }

  addCampaign(campaign: Omit<Campaign, 'id' | 'createdAt'>): void {
    const newCampaign: Campaign = {
      ...campaign,
      id: this.generateId(),
      createdAt: new Date(),
    };
    const updated = [...this.campaigns$.value, newCampaign];
    this.saveCampaigns(updated);
  }

  updateCampaign(id: string, data: Omit<Campaign, 'id' | 'createdAt'>): void {
    const updated = this.campaigns$.value.map(c =>
      c.id === id ? { ...c, ...data } : c
    );
    this.saveCampaigns(updated);
  }

  deleteCampaign(id: string): void {
    const updated = this.campaigns$.value.filter(c => c.id !== id);
    this.saveCampaigns(updated);
  }

  getCampaignById(id: string): Campaign | undefined {
    return this.campaigns$.value.find(c => c.id === id);
  }

  private saveCampaigns(campaigns: Campaign[]): void {
    this.campaigns$.next(campaigns);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(campaigns));
  }

  private loadCampaigns(): Campaign[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private loadBudget(): number {
    try {
      const raw = localStorage.getItem(this.BUDGET_KEY);
      return raw ? JSON.parse(raw) : 0;
    } catch {
      return 0;
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }
}
