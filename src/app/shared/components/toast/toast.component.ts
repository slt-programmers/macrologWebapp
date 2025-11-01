import { Component } from '@angular/core';
import { Toast } from '../../model/toast';
import { ToastService } from '../../services/toast.service';
import { NgFor } from '@angular/common';

@Component({
    selector: 'ml-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    imports: [NgFor]
})
export class ToastComponent {

  public toasts: Toast[] = [];

  constructor(private toastService: ToastService) {
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
