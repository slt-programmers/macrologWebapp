import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class HealthcheckService {

	private macrologBackendUrl = '//' + environment.backend + '/healthcheck';

	constructor(private http: HttpClient) { }

	public checkState(): Observable<boolean> {
		return this.http.get<boolean>(this.macrologBackendUrl);
	}

}
