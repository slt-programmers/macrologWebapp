import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ToastService } from './toast.service';

@Injectable()
export class AdminService {

    private macrologBackendUrl = '//' + environment.backend + '/admin';

	constructor(private http: HttpClient, private toastService: ToastService) {}

	public getAllUsers() {
		return this.http.get(this.macrologBackendUrl, { responseType: 'json' });
	}

	public deleteUser(user) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };

		this.http.delete<number>(this.macrologBackendUrl + '/' + user.id, options).subscribe(
            data => {
                this.toastService.setMessage('User account successfully deleted');
		    },
			error => {
				this.toastService.setMessage('User account could not be deleted');
				console.log(error);
			});
	}

}
