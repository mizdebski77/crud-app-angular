import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/common/campaign.service';
import { ToastService } from 'src/app/common/toast.service';
import { Campaign } from 'src/app/common/campaign.model';
import { Observable, Subject, take } from 'rxjs';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.html',
  styleUrls: ['./data-form.scss'],
})
export class DataFormComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  campaigns$!: Observable<Campaign[]>;
  availableBudget$!: Observable<number>;
  totalBudget$!: Observable<number>;
  spentBudget$!: Observable<number>;

  editId: string | null = null;
  deleteTargetId: string | null = null;
  showConfirm = false;

  searchQuery = '';
  filterCity = '';
  filterStatus = '';
  sortField: keyof Campaign = 'createdAt';
  sortDir: 'asc' | 'desc' = 'desc';

  cities = ['Warszawa', 'Kraków', 'Wrocław', 'Gdańsk', 'Poznań', 'Katowice', 'Gliwice'];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private campaignService: CampaignService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      campaignName: ['', [Validators.required, Validators.minLength(3)]],
      keywords: ['', Validators.required],
      campaignFund: [null, [Validators.required, Validators.min(1)]],
      city: ['', Validators.required],
      radius: [null, [Validators.required, Validators.min(1), Validators.max(500)]],
      status: ['on', Validators.required],
    });

    this.campaigns$ = this.campaignService.getCampaigns();
    this.availableBudget$ = this.campaignService.getAvailableBudget();
    this.totalBudget$ = this.campaignService.getTotalBudget();
    this.spentBudget$ = this.campaignService.getSpentBudget();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFilteredCampaigns(campaigns: Campaign[]): Campaign[] {
    let result = [...campaigns];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(c =>
        c.campaignName.toLowerCase().includes(q) ||
        c.keywords.toLowerCase().includes(q)
      );
    }
    if (this.filterCity) {
      result = result.filter(c => c.city === this.filterCity);
    }
    if (this.filterStatus) {
      result = result.filter(c => c.status === this.filterStatus);
    }

    result.sort((a, b) => {
      const av = a[this.sortField];
      const bv = b[this.sortField];
      let cmp = 0;
      if (typeof av === 'string' && typeof bv === 'string') cmp = av.localeCompare(bv);
      else if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return this.sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }

  setSort(field: keyof Campaign): void {
    if (this.sortField === field) {
      this.sortDir = this.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDir = 'asc';
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.value;

    this.availableBudget$.pipe(take(1)).subscribe(available => {
      const extra = this.editId
        ? val.campaignFund - (this.campaignService.getCampaignById(this.editId)?.campaignFund ?? 0)
        : val.campaignFund;

      if (extra > available) {
        this.toast.show('Not enough funds in the account.', 'error');
        return;
      }

      if (this.editId) {
        this.campaignService.updateCampaign(this.editId, val);
        this.toast.show(`Campaign "${val.campaignName}" updated successfully.`, 'success');
        this.editId = null;
      } else {
        this.campaignService.addCampaign(val);
        this.toast.show(`Campaign "${val.campaignName}" created!`, 'success');
      }

      this.form.reset({ status: 'on' });
    });
  }

  startEdit(campaign: Campaign): void {
    this.editId = campaign.id;
    this.form.patchValue({
      campaignName: campaign.campaignName,
      keywords: campaign.keywords,
      campaignFund: campaign.campaignFund,
      city: campaign.city,
      radius: campaign.radius,
      status: campaign.status,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit(): void {
    this.editId = null;
    this.form.reset({ status: 'on' });
  }

  requestDelete(id: string): void {
    this.deleteTargetId = id;
    this.showConfirm = true;
  }

  confirmDelete(): void {
    if (this.deleteTargetId) {
      const campaign = this.campaignService.getCampaignById(this.deleteTargetId);
      this.campaignService.deleteCampaign(this.deleteTargetId);
      this.toast.show(`Campaign "${campaign?.campaignName}" deleted.`, 'info');
    }
    this.showConfirm = false;
    this.deleteTargetId = null;
  }

  cancelDelete(): void {
    this.showConfirm = false;
    this.deleteTargetId = null;
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  getErrorMsg(field: string): string {
    const c = this.form.get(field);
    if (!c?.touched || !c.errors) return '';
    if (c.errors['required']) return 'This field is required.';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} characters.`;
    if (c.errors['min']) return `Minimum value is ${c.errors['min'].min}.`;
    if (c.errors['max']) return `Maximum value is ${c.errors['max'].max}.`;
    return '';
  }

  getBudgetPercent(spent: number, total: number): number {
    if (!total) return 0;
    return Math.min(100, Math.round((spent / total) * 100));
  }
}
