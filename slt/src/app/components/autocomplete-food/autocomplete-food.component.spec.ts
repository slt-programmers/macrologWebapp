import { AutocompleteFoodComponent } from "./autocomplete-food.component";
import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AuthenticationService } from "@app/services/auth.service";
import { ToastService } from "@app/services/toast.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHandler } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe('AutocompleteFoodComponent', () => {
	let component: AutocompleteFoodComponent;
	let fixture: ComponentFixture<AutocompleteFoodComponent>;
	let authService: AuthenticationService;
	let toastService: ToastService;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AutocompleteFoodComponent],
			providers: [AuthenticationService, ToastService, HttpClient, HttpHandler],
			imports: [FormsModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
			schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AutocompleteFoodComponent);
		component = fixture.componentInstance;
		authService = TestBed.get(AuthenticationService);
		toastService = TestBed.get(ToastService);
		router = TestBed.get(Router);
		fixture.detectChanges();
	});

	it('should create autocomplete food component', () => {
		expect(component).toBeTruthy();
	});

});