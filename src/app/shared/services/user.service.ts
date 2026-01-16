import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, map, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserSettings } from "../model/userSettings";
import { StravaSyncedAccount } from "../model/stravaSynchedAccount";

@Injectable()
export class UserService {
	private readonly http = inject(HttpClient);
	private readonly macrologBackendUrl =
		"//" + environment.backend + "/settings";

	getSetting(key: string, date: string): Observable<string> {
		return this.http.get<string>(this.macrologBackendUrl + "/" + key, {
			params: { date: date },
		});
	}

	getUserSettings(): Observable<UserSettings> {
		return this.http.get<UserSettings>(this.macrologBackendUrl + "/user");
	}

	getUserGoalStats(date: string): Observable<number[]> {
		return forkJoin([
			this.getSetting("goalProtein", date).pipe(map(s => +s)),
			this.getSetting("goalFat", date).pipe(map(s => +s)),
			this.getSetting("goalCarbs", date).pipe(map(s => +s)),
		]);
	}

	putUserSetting(key: string, value: string): Observable<void> {
		const setting = { name: key, value: value };
		return this.http.put<void>(this.macrologBackendUrl, setting);
	}

	getSyncSettings(key: string): Observable<StravaSyncedAccount> {
		return this.http.get<StravaSyncedAccount>(this.macrologBackendUrl + "/connectivity/" + key);
	}

	storeSyncSettings(syncWith: string, code: string): Observable<StravaSyncedAccount> {
		const userInfo = { name: "code", value: code };
		return this.http.post<StravaSyncedAccount>(
			this.macrologBackendUrl + "/connectivity/" + syncWith,
			userInfo
		);
	}

	disconnectSyncSettings(syncWith: string): Observable<void> {
		return this.http.delete<void>(
			this.macrologBackendUrl + "/connectivity/" + syncWith
		);
	}
}
