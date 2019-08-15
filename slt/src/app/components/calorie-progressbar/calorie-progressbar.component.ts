import { Component, OnInit, OnChanges, Renderer2, Input, ViewChild, ElementRef, AfterViewInit,SimpleChanges } from '@angular/core';

@Component({
	templateUrl: './calorie-progressbar.component.html',
	selector: 'calorie-progressbar',
  styleUrls: ['./calorie-progressbar.component.scss']
})
export class CalorieProgressbarComponent implements AfterViewInit, OnChanges {

	@ViewChild('innerCircle' ,  {static: false}) innerCircle: ElementRef;
	@ViewChild('outerCircle' ,  {static: false}) outerCircle: ElementRef;

	@Input() goal:number;
	@Input() achieved:number;
  @Input() text;

  public bars= new Array();
  public step = 50;

	constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.drawProgress(0,0);
	}
	ngOnChanges(changes: SimpleChanges) {
    this.drawProgress(changes.achieved.previousValue,changes.achieved.currentValue);
	}

  private drawProgress(oldValue:number, newValue:number){
     this.bars= new Array();
     for (var i=0; i<this.goal;i=i+this.step) {
        if (i<this.achieved){
          this.bars.push({'progress':'achieved'});
        } else {
          this.bars.push({'progress':'todo'});
        }
     }
  }
}
