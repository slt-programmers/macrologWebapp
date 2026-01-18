import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Toast } from '../model/toast';

@Injectable()
export class ToastService {
  public messageObservable: Observable<Toast>;
  
  private message: Subject<Toast>;

  constructor() {
    this.message = new Subject<Toast>();
    this.messageObservable = this.message.asObservable();
  }

  public setMessage(message: string, isError: boolean, title: string) {
    this.message.next({ message, isError, title });
  }
}
