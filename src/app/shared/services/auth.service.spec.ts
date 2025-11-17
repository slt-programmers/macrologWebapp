import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "./auth.service";

describe("AuthService", () => {
	let http: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [AuthenticationService, MockProvider(HttpClient)],
		});
		http = TestBed.inject(HttpClient);
	});

	it("should create service", () => {
		const service = TestBed.inject(AuthenticationService);
		expect(service).toBeTruthy();
	});

	it("should log in", () => {
		spyOn(http, "post");
		const service = TestBed.inject(AuthenticationService);
		service.login("username", "password");
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/api/authenticate",
			{
				username: "username",
				password: "password",
			}
		);
	});

	it("should change password", async () => {
		spyOn(http, "post").and.returnValue(of({}));
		const service = TestBed.inject(AuthenticationService);
		await service.changePassword("test", "test2", "test2").toPromise();
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/api/changePassword",
			{
				oldPassword: "test",
				newPassword: "test2",
				confirmPassword: "test2",
			}
		);
	});

	it("should register", async () => {
		spyOn(http, "post").and.returnValue(of({}));
		const service = TestBed.inject(AuthenticationService);
		const result = await service
			.register("username", "email@email.com", "password")
			.toPromise();
		expect(result).toEqual({});
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/api/signup",
			{
				username: "username",
				email: "email@email.com",
				password: "password",
			}
		);
	});

	it("should reset password", async () => {
		spyOn(http, "post").and.returnValue(of({}));
		const service = TestBed.inject(AuthenticationService);
		await service.resetPassword("email@email.com").toPromise();
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/api/resetPassword",
			{
				email: "email@email.com",
			}
		);
	});

	it("should delete account", async () => {
		spyOn(http, "post").and.returnValue(of({}));
		const service = TestBed.inject(AuthenticationService);
		await service.deleteAccount("password").toPromise();
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/api/deleteAccount",
			null,
			{
				params: { password: "password" },
			}
		);
	});
});
