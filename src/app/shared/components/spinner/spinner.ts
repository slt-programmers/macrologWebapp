import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ml-spinner',
  imports: [FontAwesomeModule],
  templateUrl: './spinner.html',
  styles: `
    fa-icon {
      color: var(--secondary);
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }`
})
export class Spinner {
  faSpinner = faSpinner;
}
