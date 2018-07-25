import {Directive, Injectable, Renderer, ElementRef} from'@angular/core';

@Directive({
	selector: '[toast]'
})
export class ToastDirective {

	private nativeElement: Node;

	constructor(private renderer: Renderer,
							private element: ElementRef) {
		this.nativeElement = element.nativeElement;
	}

	public showToast() {
		console.log('In the showToast');
		console.log(this.nativeElement);
		this.renderer.setElementStyle(this.nativeElement, 'height', '50px');
		setTimeout( () => this.renderer.setElementStyle(this.nativeElement, 'height', '0'), 1200);
	}

}