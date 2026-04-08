import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts = this.toasts$.asObservable();

  show(message: string, type: Toast['type'] = 'success'): void {
    const toast: Toast = { id: this.generateId(), message, type };
    this.toasts$.next([...this.toasts$.value, toast]);
    setTimeout(() => this.remove(toast.id), 3500);
  }

  remove(id: string): void {
    this.toasts$.next(this.toasts$.value.filter(t => t.id !== id));
  }

  private generateId(): string {
    return Math.random().toString(36).slice(2);
  }
}
