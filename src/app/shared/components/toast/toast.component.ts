import { Component, Renderer2, ViewChild } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'toast-component',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  @ViewChild('toast') toast: any;

  public message: string = '';
  public title: string = '';
  public isError = false;

  constructor(private toastService: ToastService, private renderer: Renderer2) {
    this.toastService.messageObservable.subscribe(it => {
      this.title = it.title;
      this.message = it.message;
      this.isError = it.isError;
      this.showToast();
    });
  }

  public showToast() {
    this.renderer.setStyle(this.toast.nativeElement, 'opacity', '1');
    this.renderer.setStyle(this.toast.nativeElement, 'top', '2rem');
  }

  public closeToast() {
    this.title = '';
    this.message = '';
    this.isError = false;
    this.renderer.setStyle(this.toast.nativeElement, 'top', '3rem');
    this.renderer.setStyle(this.toast.nativeElement, 'opacity', '0');

  }
}
