import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Weight } from "../model/weight";
import { environment } from "../../../environments/environment";
import { Observable } from "rxjs";

@Injectable()
export class WeightService {
	private http = inject(HttpClient);

	macrologBackendUrl = "//" + environment.backend + "/weight";
	activities = [];

	public getAllWeights() {
		return this.http.get<Weight[]>(this.macrologBackendUrl);
	}

	public addWeight(weight: Weight): Observable<Weight> {
		return this.http.post<Weight>(this.macrologBackendUrl, weight);
	}

	public deleteWeight(weight: Weight): Observable<void> {
		return this.http.delete<void>(this.macrologBackendUrl + "/" + weight.id);
	}
}
