import { Component } from '@angular/core';
import { NavigationComponent } from '../../../shared/components/navigation/navigation.component';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'ml-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [NavigationComponent, FontAwesomeModule]
})
export class HomeComponent {
  faPlus = faPlus;
  faMinus = faMinus
}
