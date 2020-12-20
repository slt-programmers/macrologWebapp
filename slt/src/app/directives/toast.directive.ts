import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[toast]',
})
export class ToastDirective {
  private nativeElement: Node;

  constructor(private renderer: Renderer2, private element: ElementRef) {
    this.nativeElement = element.nativeElement;
  }

  public showToast() {
    this.renderer.setStyle(this.nativeElement, 'height', '50px');
    setTimeout(
      () => this.renderer.setStyle(this.nativeElement, 'height', '0'),
      1200
    );
  }
}
