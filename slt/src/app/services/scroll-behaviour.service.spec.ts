import { TestBed } from "@angular/core/testing";
import { ScrollBehaviourService } from "./scroll-behaviour.service";
import { Renderer2 } from "@angular/core";

class MockRenderer {
    removeClass() {}
    addClass() {}
}

describe('ScrollBehaviourService', () => {
    let service: ScrollBehaviourService;
    let renderer: Renderer2;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ScrollBehaviourService, {provide: Renderer2, useClass: MockRenderer}]
        });
        service = TestBed.get(ScrollBehaviourService);
        renderer = TestBed.get(Renderer2);
        service.renderer = renderer;
    });

    afterEach(() => {
        localStorage.clear();
    })

    it('should create service', () => {
        expect(service).toBeTruthy();
    });

    it('should prevent scrolling', () => {
        spyOn(renderer, 'removeClass');
        service.preventScrolling(false);
        expect(renderer.removeClass).toHaveBeenCalled();

        spyOn(renderer, 'addClass');
        service.preventScrolling(true);
        expect(renderer.addClass).toHaveBeenCalled();
    });
});
