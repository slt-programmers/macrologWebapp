import { Component, EventEmitter, Output, input } from '@angular/core';

@Component({
    selector: 'ml-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  readonly title = input.required<string>();
  @Output() close$: EventEmitter<any> = new EventEmitter<any>();

  public closeModal() {
    this.close$.emit();
  }

}
