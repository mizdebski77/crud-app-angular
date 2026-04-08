import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CampaignService } from 'src/app/common/campaign.service';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  inputValue: number = 1000;
  existingBudget$!: Observable<number>;
  hasCampaigns$!: Observable<boolean>;

  constructor(private router: Router, private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.existingBudget$ = this.campaignService.getTotalBudget();
    this.hasCampaigns$ = this.campaignService.getCampaigns().pipe(
      map(c => c.length > 0)
    );
  }

  goToNextPage(): void {
    this.campaignService.setTotalBudget(this.inputValue);
    this.router.navigate(['/form']);
  }

  continueDashboard(): void {
    this.router.navigate(['/form']);
  }
}
