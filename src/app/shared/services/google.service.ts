import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { ConnectivityRequest } from "../model/connectivityRequest";
import { ConnectivityStatus } from "../model/connectivityStatus";
import { MailRequest } from "../model/mailRequest";
import { Observable } from "rxjs";

@Injectable()
export class GoogleService {
	private readonly http = inject(HttpClient);

	private macrologBackendUrl = "//" + environment.backend + "/admin/mail";

	public getStatus(): Observable<ConnectivityStatus> {
		return this.http.get<ConnectivityStatus>(
			this.macrologBackendUrl + "/status"
		);
	}

	public storeMailSyncSettings(code: string): Observable<void> {
		const connectivityRequest: ConnectivityRequest = {
			clientAuthorizationCode: code,
		};
		return this.http.post<void>(
			this.macrologBackendUrl,
			connectivityRequest
		);
	}

	public sendTestMail(mailAddress: string): Observable<void> {
		const mailRequest = new MailRequest(mailAddress);
		return this.http.post<void>(this.macrologBackendUrl + "/testmail", mailRequest);
	}
}
