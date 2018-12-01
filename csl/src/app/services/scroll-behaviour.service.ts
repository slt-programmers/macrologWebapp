import { Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class ScrollBehaviourService {

	public renderer: Renderer2;

	constructor() { }

	public preventScrolling(toggle: boolean) {
		if (toggle) {
			this.renderer.addClass(document.body, 'overlay-active');
		} else {
			this.renderer.removeClass(document.body, 'overlay-active');
		}
	}
}
