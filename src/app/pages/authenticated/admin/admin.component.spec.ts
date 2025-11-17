import { HttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, RouterOutlet } from "@angular/router";
import { MockProvider } from "ng-mocks";
import { ToastService } from "src/app/shared/services/toast.service";
import { UserService } from "src/app/shared/services/user.service";
import { AdminComponent } from "./admin.component";

describe("AdminComponent", () => {
	let component: AdminComponent;
	let fixture: ComponentFixture<AdminComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterOutlet, AdminComponent],
			providers: [
				provideRouter([]),
				MockProvider(ToastService),
				MockProvider(UserService),
				MockProvider(HttpClient),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AdminComponent);
		component = fixture.componentInstance;
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});
});
