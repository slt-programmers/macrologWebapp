import { Component, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Toast } from '../../model/toast';
import { ToastService } from '../../services/toast.service';


@Component({
  selector: 'ml-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports: [FontAwesomeModule]
})
export class ToastComponent {
  faTimes = faTimes;

  private toastService = inject(ToastService);

  toasts: Toast[] = [];

  constructor() {
    this.toastService.messageObservable.subscribe(it => {
      this.toasts.push({
        title: it.title,
        message: it.message,
        isError: it.isError,
      });
    });
  }

  closeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}
