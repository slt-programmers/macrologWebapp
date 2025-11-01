import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ml-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() title: string;
  @Output() close$: EventEmitter<any> = new EventEmitter<any>();

  public closeModal() {
    this.close$.emit();
  }

}
