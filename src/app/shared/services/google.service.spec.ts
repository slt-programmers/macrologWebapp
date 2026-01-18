import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { firstValueFrom, of } from "rxjs";
import { environment } from "src/environments/environment";
import { ConnectivityStatus } from "../model/connectivityStatus";
import { MailRequest } from "../model/mailRequest";
import { GoogleService } from "./google.service";

describe("GoogleService", () => {
	let service: GoogleService;
	let http: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [GoogleService, MockProvider(HttpClient)],
		});
		service = TestBed.inject(GoogleService);
		http = TestBed.inject(HttpClient);
	});

	it("should create", () => {
		expect(service).toBeTruthy();
	});

	it("should get status", async () => {
		spyOn(http, "get").and.returnValue(of({} as ConnectivityStatus));
		const result = await firstValueFrom(service.getStatus());
		expect(result).toEqual({} as ConnectivityStatus);
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/admin/mail/status"
		);
	});

	it("should store mail sync settings", async () => {
		spyOn(http, "post").and.returnValue(of(undefined));
		const result = await firstValueFrom(service.storeMailSyncSettings("code"));
		expect(result).toEqual(undefined);
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/admin/mail",
			{ clientAuthorizationCode: "code" },
		);
	});

	it("should send testmail", async () => {
		spyOn(http, "post").and.returnValue(of(undefined));
		const result = await firstValueFrom(service.sendTestMail("adress"));
		expect(result).toEqual(undefined);

		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/admin/mail/testmail",
			new MailRequest("adress"),
		);
	});
});
