import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { firstValueFrom, of } from "rxjs";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "./auth.service";
import { UserAccount } from "../model/userAccount";

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
		await firstValueFrom(service.changePassword("test", "test2", "test2"));
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
		const result = await firstValueFrom(service
			.register("username", "email@email.com", "password"));
		expect(result).toEqual({} as UserAccount);
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
		await firstValueFrom(service.resetPassword("email@email.com"));
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
		await firstValueFrom(service.deleteAccount("password"));
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/api/deleteAccount",
			null,
			{
				params: { password: "password" },
			}
		);
	});
});
