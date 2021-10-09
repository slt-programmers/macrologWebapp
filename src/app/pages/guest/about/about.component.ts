import { Component} from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
	selector: 'about',
	templateUrl: './about.component.html',
  animations: [
		trigger('enterLeaveTrigger', [
			transition(':enter', [
				style({ opacity: 0, marginTop: '15px' }),
				animate('0.3s', style({ opacity: 1, marginTop: '0' })),
			]),
		]),
	],
	styleUrls: ['./about.component.scss']
})
export class AboutComponent {

}
