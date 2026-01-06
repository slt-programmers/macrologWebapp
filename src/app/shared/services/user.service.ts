import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserSettings } from "../model/userSettings";

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

	getUserGoalStats(date: string): Observable<string[]> {
		return forkJoin([
			this.getSetting("goalProtein", date),
			this.getSetting("goalFat", date),
			this.getSetting("goalCarbs", date),
		]);
	}

	putUserSetting(key: string, value: string): Observable<any> {
		const setting = { name: key, value: value };
		return this.http.put<any>(this.macrologBackendUrl, setting);
	}

	getSyncSettings(key: string): Observable<any> {
		return this.http.get<any>(this.macrologBackendUrl + "/connectivity/" + key);
	}

	storeSyncSettings(syncWith: string, code: string): Observable<any> {
		const userInfo = { name: "code", value: code };
		return this.http.post<any>(
			this.macrologBackendUrl + "/connectivity/" + syncWith,
			userInfo
		);
	}

	disconnectSyncSettings(syncWith: string): Observable<any> {
		return this.http.delete<any>(
			this.macrologBackendUrl + "/connectivity/" + syncWith
		);
	}
}
