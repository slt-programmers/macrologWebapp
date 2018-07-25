import {Injectable, ViewChild} from'@angular/core';
import {ToastDirective} from '../directives/toast.directive';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ToastService {

	private message: Subject<string>;

	messageObservable: Observable<string>;

	constructor() {
		this.message = new Subject<string>();
		this.messageObservable = this.message.asObservable();
	}

	public setMessage(message: string) {
		console.log(message);
		this.message.next(message);
	}
}
