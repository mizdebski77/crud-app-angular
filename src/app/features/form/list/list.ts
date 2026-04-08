import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Campaign } from 'src/app/common/campaign.model';

@Component({
  selector: 'app-list',
  template: '',
})
export class ListComponent {
  @Input() campaigns: Campaign[] = [];
  @Output() editCampaign = new EventEmitter<string>();
  @Output() deleteCampaign = new EventEmitter<string>();
}
