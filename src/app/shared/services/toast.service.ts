import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ToastService {
  
  public messageObservable: Observable<any>;
  private message: Subject<any>;

  constructor() {
    this.message = new Subject<any>();
    this.messageObservable = this.message.asObservable();
  }

  public setMessage(message: string, isError?: boolean, title?: string) {
    this.message.next({ message, isError, title });
  }
}
