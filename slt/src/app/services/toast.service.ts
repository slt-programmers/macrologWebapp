import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ToastService {
  private message: Subject<string>;

  public messageObservable: Observable<string>;

  constructor() {
    this.message = new Subject<string>();
    this.messageObservable = this.message.asObservable();
  }

  public setMessage(message: string) {
    this.message.next(message);
  }
}
