import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ToastService {
  public messageObservable: Observable<object>;
  private message: Subject<object>;

  constructor() {
    this.message = new Subject<object>();
    this.messageObservable = this.message.asObservable();
  }

  public setMessage(message: string, isError?: boolean) {
    this.message.next({ message, isError });
  }
}
