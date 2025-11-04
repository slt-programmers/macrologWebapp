import { Component, input, output } from '@angular/core';

@Component({
  selector: 'ml-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  readonly title = input.required<string>();
  readonly close$ = output<void>();

  closeModal(): void {
    this.close$.emit();
  }

}
