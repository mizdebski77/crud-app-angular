import { Component } from '@angular/core';
import { ToastService } from '../toast.service';
import { Observable } from 'rxjs';
import { Toast } from '../toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrls: ['./toast.scss'],
})
export class ToastComponent {
  toasts$: Observable<Toast[]>;

  constructor(public toastService: ToastService) {
    this.toasts$ = toastService.toasts;
  }
}
