import { Component, input, output } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ml-modal',
  templateUrl: './modal.component.html',
  imports: [FontAwesomeModule],
  styleUrl: './modal.component.css'
})
export class ModalComponent {
  faTimes = faTimes;
  readonly title = input.required<string>();
  readonly close$ = output<void>();

  closeModal(): void {
    this.close$.emit();
  }

}
