import{Component, OnInit}from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

	public name: string;
	public height: number;
	public weight: number;
	public intakeGoal: number;

  constructor() {
	}

  ngOnInit() {
		this.name = 'John Doe';
		this.height = 170;
		this.weight = 75.0;
		this.intakeGoal = 1800;
  }

}
