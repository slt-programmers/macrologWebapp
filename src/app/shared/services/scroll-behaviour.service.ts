import { Injectable, Renderer2, RendererFactory2, inject } from '@angular/core';

@Injectable()
export class ScrollBehaviourService {
  private rendererFactory2 = inject(RendererFactory2);

  private renderer2: Renderer2;

  constructor() {
    this.renderer2 = this.rendererFactory2.createRenderer(null, null);
  }

  public preventScrolling(toggle: boolean): void {
    if (toggle && this.renderer2) {
      this.renderer2.addClass(document.body, 'overlay-active');
    } else {
      this.renderer2.removeClass(document.body, 'overlay-active');
    }
  }

  public setRenderer(renderer2: Renderer2) {
    this.renderer2 = renderer2;
  }
}
