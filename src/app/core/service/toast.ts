import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastData {
  message: string;
  type: 'success' | 'error';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<ToastData[]>([]);
  toast$ = this.toastsSubject.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    const id = Date.now();
    const currentToasts = this.toastsSubject.value;
    const newToast: ToastData = { message, type, id };

    this.toastsSubject.next([...currentToasts, newToast]);
    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    const currentToast = this.toastsSubject.value;
    this.toastsSubject.next(currentToast.filter(t => t.id !== id));
  }
}
