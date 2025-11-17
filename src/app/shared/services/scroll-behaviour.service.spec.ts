import { TestBed } from "@angular/core/testing";
import { ScrollBehaviourService } from "./scroll-behaviour.service";
import { Renderer2 } from "@angular/core";

class MockRenderer {
	removeClass() {}
	addClass() {}
}

describe("ScrollBehaviourService", () => {
	let service: ScrollBehaviourService;
	let renderer2: Renderer2;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ScrollBehaviourService,
				{ provide: Renderer2, useClass: MockRenderer },
			],
		});
		service = TestBed.inject(ScrollBehaviourService);
		renderer2 = TestBed.inject(Renderer2);
		service.setRenderer(renderer2);
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("should create service", () => {
		expect(service).toBeTruthy();
	});

	it("should prevent scrolling", () => {
		spyOn(renderer2, "removeClass");
		service.preventScrolling(false);
		expect(renderer2.removeClass).toHaveBeenCalled();

		spyOn(renderer2, "addClass");
		service.preventScrolling(true);
		expect(renderer2.addClass).toHaveBeenCalled();
	});
});
