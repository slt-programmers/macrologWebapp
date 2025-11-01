import { Component, inject } from '@angular/core';
import { Toast } from '../../model/toast';
import { ToastService } from '../../services/toast.service';


@Component({
    selector: 'ml-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    imports: []
})
export class ToastComponent {
  private toastService = inject(ToastService);


  public toasts: Toast[] = [];

  constructor() {
    this.toastService.messageObservable.subscribe(it => {
      this.toasts.push({
        title: it.title,
        message: it.message,
        isError: it.isError,
      });
    });
  }

  public closeToast(index: number) {
    this.toasts.splice(index, 1);
  }
}
