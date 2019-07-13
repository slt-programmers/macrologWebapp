import {
	Component, OnChanges, ViewChild,
	ElementRef, Input, Output, EventEmitter, SimpleChanges, AfterViewInit
} from '@angular/core';

@Component({
	selector: 'slider',
	templateUrl: './slider.component.html'
})
export class SliderComponent implements AfterViewInit, OnChanges {

	@ViewChild('slider', { static: false }) private sliderElement: ElementRef;
	@ViewChild('sliderHandle', { static: false }) private handleElement: ElementRef;
	@ViewChild('trackFill', { static: false }) private trackElement: ElementRef;
	@ViewChild('lowerMark', { static: false }) private lowerMarkElement: ElementRef;
	@ViewChild('baseMark', { static: false }) private baseMarkElement: ElementRef;
	@ViewChild('upperMark', { static: false }) private upperMarkElement: ElementRef;

	@Input() value;
	@Input() upperBound;
	@Input() lowerBound;
	@Input() markers;

	@Output() valueChange: EventEmitter<number> = new EventEmitter<number>();

	private mouseDown = false;
	private oldXChord: number;
	private newXChord: number;
	private slider;
	private sliderHandle;
	private track;
	private lowerMark;
	private baseMark;
	private upperMark;
	private boundary;

	private sliderOffsetLeft;
	private sliderOffsetRight;
	private sliderWidth;

	constructor() {
	}

	ngAfterViewInit() {
		this.slider = this.sliderElement.nativeElement;
		this.sliderHandle = this.handleElement.nativeElement;
		this.track = this.trackElement.nativeElement;
		this.lowerMark = this.lowerMarkElement.nativeElement;
		this.baseMark = this.baseMarkElement.nativeElement;
		this.upperMark = this.upperMarkElement.nativeElement;

		this.sliderWidth = this.slider.clientWidth;
		this.sliderOffsetLeft = this.getOffsetLeft(this.slider);
		this.sliderOffsetRight = this.sliderOffsetLeft + this.sliderWidth;

		this.boundary = {
			left: this.sliderOffsetLeft,
			right: this.sliderOffsetRight
		};
		this.initHandle();
		this.initMarkers();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.value = changes.value.currentValue;
		if (this.slider !== undefined) {
			this.initHandle();
		}
	}

	private initHandle() {
		const part = this.value - this.lowerBound;
		const percentage = part / (this.upperBound - this.lowerBound);

		if (this.sliderHandle && this.track) {
			this.sliderHandle.style.left = (this.sliderWidth * percentage) - (this.sliderHandle.clientWidth / 2) + 'px';
			this.track.style.width = (this.sliderWidth * percentage) + 'px';
		}
	}

	private initMarkers() {
		let part = this.markers[0].value - this.lowerBound;
		let percentage = part / (this.upperBound - this.lowerBound);
		this.lowerMark.style.left = (this.sliderWidth * percentage - 2) + 'px';

		part = this.markers[1].value - this.lowerBound;
		percentage = part / (this.upperBound - this.lowerBound);
		this.baseMark.style.left = (this.sliderWidth * percentage - 2) + 'px';

		part = this.markers[2].value - this.lowerBound;
		percentage = part / (this.upperBound - this.lowerBound);
		this.upperMark.style.left = (this.sliderWidth * percentage - 2) + 'px';
	}

	private calculateValue() {
		const total = this.upperBound - this.lowerBound;
		this.value = (total * (this.newXChord / this.sliderWidth)) + this.lowerBound;
		this.valueChange.emit(this.value);
	}

	// Mouse and touch behaviour
	public onDown(event) {
		event.preventDefault(); // prevent mouseclick when mobile, good practice
		this.mouseDown = true;
		this.onClick(event);
	}

	public onUp(event) {
		this.sliderHandle.style.transition = 'left 0.3s';
		this.track.style.transition = 'width 0.3s';
		this.mouseDown = false;
	}

	public onMove(event): void {
		event.preventDefault();
		const location = this.getMouseLocation(event);

		if (this.mouseDown && this.isInBoundary(location)) {
			this.newXChord = location - this.sliderOffsetLeft;
			const distance = this.oldXChord - this.newXChord;
			this.oldXChord = this.newXChord;
			this.sliderHandle.style.left = (this.sliderHandle.offsetLeft - distance) + 'px';
			this.sliderHandle.style.transition = 'none';
			this.track.style.width = (this.track.offsetWidth - distance) + 'px';
			this.track.style.transition = 'none';
			this.calculateValue();
		} else {
			// dragging out of boundary
			this.mouseDown = false;
		}
	}

	public onClick(event): void {
		event.preventDefault();
		const location = this.getMouseLocation(event);
		if (this.isInBoundary(location)) {
			this.newXChord = location - this.boundary.left;
			this.sliderHandle.style.left = (this.newXChord - (this.sliderHandle.clientWidth / 2)) + 'px';
			this.track.style.width = this.newXChord + 'px';

			this.calculateValue();
		}
	}

	private isInBoundary(location: number) {
		return (location >= this.boundary.left && location <= (this.boundary.right));
	}

	private getMouseLocation(event): number {
		let location;
		if (event.touches !== undefined) {
			location = event.touches[0].clientX; // mobile is different apparently
		} else {
			location = event.clientX;
		}
		return location;
	}

	private getOffsetLeft(slider) {
		let offsetLeft = 0;
		do {
			if (!isNaN(slider.offsetLeft)) {
				offsetLeft += slider.offsetLeft;
			}
		} while (slider = slider.offsetParent);
		return offsetLeft;
	}

}
