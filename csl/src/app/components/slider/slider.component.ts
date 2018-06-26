import{Component, OnInit, Inject, ViewChild, ElementRef}from '@angular/core';

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
	public slider;
	public sliderHandle;
	public track;
	public boundary;

	public sliderOffset;

  constructor() { }

  ngOnInit() {
		this.slider = this.sliderElement.nativeElement;
		this.sliderHandle = this.handleElement.nativeElement;
		this.track = this.trackElement.nativeElement;

		// position 0%
		this.sliderOffsetLeft = this.getOffsetLeft(this.slider);
		// position 100%
		this.sliderOffsetRight = this.sliderOffsetLeft + this.slider.clientWidth;

		console.log(this.sliderElement);
		console.log(this.slider);
		console.log(this.sliderOffsetLeft);
		console.log(this.sliderOffsetRight);

		this.boundary = {
			left: this.sliderOffsetLeft,
			right: this.sliderOffsetRight
		};
  }

	getOffsetLeft(slider) {
    let offsetLeft = 0;
    do {
      if ( !isNaN( slider.offsetLeft ) ) {
				offsetLeft += slider.offsetLeft;
      }
    } while( slider = slider.offsetParent );
    return offsetLeft;
	}

	public onDown(event) {
		console.log(event);
		console.log(event.path[0]);
		event.preventDefault();
		let location = this.getLocation(event);

		this.mouseDown = true;
		this.startXChord = location;
		this.onClick(event);
	}

	public onUp(event) {
		this.mouseDown = false;
	}

	public onMove(event): void {
		event.preventDefault();
		let location = this.getLocation(event);

		if (this.mouseDown && this.isInBoundary(location)) {
			this.newXChord = location;
			let distance = this.startXChord - this.newXChord;
			this.startXChord = this.newXChord;
			this.sliderHandle.style.left = (this.sliderHandle.offsetLeft - distance) + 'px';
			this.track.style.width = (this.track.offsetWidth - distance) + 'px';
		} else {
			this.mouseDown = false;
		}
	}

	public onClick(event): void {
		event.preventDefault();
		let location = this.getLocation(event);
		if (this.isInBoundary(location)) {
			this.newXChord = location - this.boundary.left;
			this.sliderHandle.style.left = (this.newXChord - (this.sliderHandle.clientWidth / 2)) + 'px';
			this.track.style.width = this.newXChord + 'px';
		}
	}

	private isInBoundary(location: number) {
		return (location >= this.boundary.left && location <= (this.boundary.right));
	}

	private getLocation(event): number {
		let location;
		if (event.touches !== undefined) {
			location = event.touches[0].clientX;
		} else {
			location = event.clientX;
		}
		return location;
	}
}
