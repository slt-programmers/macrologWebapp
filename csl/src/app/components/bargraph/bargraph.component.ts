import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, ElementRef, Input } from '@angular/core';

@Component({
  selector: 'bargraph',
  templateUrl: './bargraph.component.html',
  styleUrls: ['./bargraph.component.scss']
})
export class BargraphComponent implements OnInit {

	@ViewChild('trackFill') private trackFillElement: ElementRef;

	@Input() percentage: number;
  @Input() title: string;

  public trackFill;

  constructor() { }

  ngOnInit() {
		this.trackFill = this.trackFillElement.nativeElement;
		this.trackFill.style.width = this.percentage + '%';

  }

	onChange() {
		console.log(this.percentage);
    console.log(this.title);
		this.trackFill.style.width = this.percentage + '%';
	}


}
