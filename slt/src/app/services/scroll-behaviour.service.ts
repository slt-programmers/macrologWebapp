import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class ScrollBehaviourService {

	constructor(private renderer: Renderer2) { }

	public preventScrolling(toggle: boolean): void {
		if (toggle && this.renderer) {
			this.renderer.addClass(document.body, 'overlay-active');
		} else {
			this.renderer.removeClass(document.body, 'overlay-active');
		}
	}

	public setRenderer(renderer: Renderer2) {
		this.renderer = renderer;
	}
}
