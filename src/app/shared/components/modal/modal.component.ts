import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ml-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  @Input() title: String;
  @Output() close$: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  public closeModal() {
    this.close$.emit();
  }

}
