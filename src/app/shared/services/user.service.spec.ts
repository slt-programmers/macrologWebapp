import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MockProvider } from "ng-mocks";
import { firstValueFrom, of } from "rxjs";
import { environment } from "src/environments/environment";
import { UserSettings } from "../model/userSettings";
import { UserService } from "./user.service";
import { StravaSyncedAccount } from "../model/stravaSynchedAccount";

describe("UserService", () => {
	let service: UserService;
	let http: HttpClient;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [UserService, MockProvider(HttpClient)],
		});
		service = TestBed.inject(UserService);
		http = TestBed.inject(HttpClient);
	});

	it("should create", () => {
		expect(service).toBeTruthy();
	});

	it("should get settings", async () => {
		spyOn(http, "get").and.returnValue(of("test"));
		const result = await firstValueFrom(service.getSetting("test", "2021-01-01"));
		expect(result).toEqual("test");
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/test",
			{ params: { date: "2021-01-01" } }
		);
	});

	it("should get user settings", async () => {
		spyOn(http, "get").and.returnValue(of({ name: "tester" } as UserSettings));
		const result = await firstValueFrom(service.getUserSettings());
		expect(result).toEqual({ name: "tester" } as UserSettings);
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/user"
		);
	});

	it("should add user settings", async () => {
		spyOn(http, "put").and.returnValue(of(undefined));
		const result = await firstValueFrom(service.putUserSetting("name", "tester"));
		expect(result).toEqual(undefined);
		expect(http.put).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings",
			{ name: "name", value: "tester" }
		);
	});

	it("should get user goal stats", async () => {
		spyOn(http, "get").and.returnValues(of("123"), of("234"), of("345"));
		const result = await firstValueFrom(service.getUserGoalStats("2022-01-01"));
		expect(result).toEqual([123, 234, 345]);
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/goalProtein",
			{ params: { date: "2022-01-01" } }
		);
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/goalFat",
			{ params: { date: "2022-01-01" } }
		);
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/goalCarbs",
			{ params: { date: "2022-01-01" } }
		);
	});

	it("should get sync settings", async () => {
		spyOn(http, "get").and.returnValue(of({}));
		const result = await firstValueFrom(service.getSyncSettings("STRAVA"));
		expect(result).toEqual({} as StravaSyncedAccount);
		expect(http.get).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/connectivity/STRAVA"
		);
	});

	it("should store sync settings", async () => {
		spyOn(http, "post").and.returnValue(of({}));
		const result = await firstValueFrom(service
			.storeSyncSettings("STRAVA", "code"));
		expect(result).toEqual({} as StravaSyncedAccount);
		expect(http.post).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/connectivity/STRAVA",
			{ name: "code", value: "code" }
		);
	});

	it("should disconnect sync settings", async () => {
		spyOn(http, "delete").and.returnValue(of(undefined));
		const result = await firstValueFrom(service.disconnectSyncSettings("STRAVA"));
		expect(result).toEqual(undefined);
		expect(http.delete).toHaveBeenCalledWith(
			"//" + environment.backend + "/settings/connectivity/STRAVA"
		);
	});
});
