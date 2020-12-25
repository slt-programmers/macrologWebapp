import { Component, Renderer2, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'toast-component',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @ViewChild('toast') toast: any;

  public message: string;
  public isError: boolean;

  constructor(private toastService: ToastService, private renderer: Renderer2) {
    this.toastService.messageObservable.subscribe((messageObj: any) => {
      this.message = messageObj.message;
      this.isError = messageObj.isError;
      this.showToast();
    });
  }

  public showToast() {
    this.renderer.setStyle(this.toast.nativeElement, 'height', '50px');
    setTimeout(
      () => this.renderer.setStyle(this.toast.nativeElement, 'height', '0'),
      1200
    );
  }
}
