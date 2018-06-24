import{Component, OnInit, Inject, ViewChild}from '@angular/core';

@Component({
  selector: 'slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {

	@ViewChild('slider') private sliderElement: ElementRef;
  @ViewChild('sliderHandle') private handleElement: ElementRef;
	@ViewChild('trackFill') private trackElement: ElementRef;

	public mouseDown = false;
	public startXChord;
	public newXChord;

  constructor() { }

  ngOnInit() {
		this.slider = this.sliderElement.nativeElement;
		this.sliderHandle = this.handleElement.nativeElement;
		this.track = this.trackElement.nativeElement;

		this.boundary = {
			left: this.slider.offsetLeft,
			right: this.slider.clientWidth + this.slider.offsetLeft)
		};
  }

	public onDown(event: MouseEvent) {
		this.mouseDown = true;
		this.startXChord = event.clientX;
		this.onClick(event);
	}

	public onUp(event: MouseEvent) {
		this.mouseDown = false;
	}

	public onMove(event: MouseEvent): void {
		if (this.mouseDown && this.isInBoundary(event.clientX)) {
			this.newXChord = event.clientX;
			let distance = this.startXChord - this.newXChord;
			this.startXChord = this.newXChord;
			this.sliderHandle.style.left = (this.sliderHandle.offsetLeft - distance) + 'px';
			this.track.style.width = (this.track.offsetWidth - distance) + 'px';
		} else {
			this.mouseDown = false;
		}
	}

	public onClick(event: MouseEvent): void {
		if (this.isInBoundary(event.clientX) {
			this.newXChord = event.clientX - this.boundary.left;
			this.sliderHandle.style.left = (this.newXChord - (this.sliderHandle.clientWidth / 2)) + 'px';
			this.track.style.width = this.newXChord + 'px';
		}
	}

	private isInBoundary(location: number) {
		return (location >= this.boundary.left && location <= (this.boundary.right));
	}
}
