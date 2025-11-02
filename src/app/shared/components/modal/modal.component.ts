import { Component, input, output } from '@angular/core';

@Component({
    selector: 'ml-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  readonly title = input.required<string>();
  readonly close$ = output<void>();

  public closeModal() {
    this.close$.emit();
  }

}
