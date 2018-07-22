import {Component, ViewChild} from '@angular/core';
import {ToastService} from '../../services/toast.service';
import {ToastDirective} from '../../directives/toast.directive';

@Component({
  selector: 'toast-component',
  templateUrl: './toast.component.html'
})
export class ToastComponent {

	@ViewChild(ToastDirective) vc: ToastDirective;

	public message: string;

	constructor(private toastService: ToastService) {
		this.toastService.messageObservable.subscribe((message: string) => {
			console.log('In the subscribe');
			this.message = message;
			this.vc.showToast();
		})
	}

}