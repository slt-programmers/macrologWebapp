import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserService } from '../../../services/user.service';
import { WeightService } from '../../../services/weight.service';
import { LogWeight} from '../../../model/logWeight';
import { ToastService } from '../../../services/toast.service';
import { DateValidator } from '../../../directives/date.directive';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
	selector: 'user-weighttracker',
	templateUrl: './user.weighttracker.component.html'
})
export class UserWeightTrackerComponent {

	private originalResult;

	public trackedWeights = new Array<LogWeight>();

	public measurementDate;
	public weight;
  public weightForm;

  private pipe: DatePipe;

	constructor(private userService: UserService,
              private weightService: WeightService,
							private toastService: ToastService) {

     this.getAllWeights();
     this.pipe = new DatePipe('en-US');
	}
	private getAllWeights() {
		this.weightService.getAllWeights().subscribe(
			data => {
				this.trackedWeights = data;
        this.trackedWeights= this.trackedWeights.sort((a, b) => {
            var date1 = moment(a.day, 'YYYY-M-D', true);
            var date2 = moment(b.day, 'YYYY-M-D', true);
            var compare =  this.compare(date1,date2);
            return compare;
        })
			},
			error => console.log(error)
		);
	}

 private compare(momentA, momentB) {
    if (momentA.isBefore(momentB)) return 1;
    else if (momentA.isAfter(momentB)) return -1;
    else return 0;
}

  public reset() {
     this.weightForm.reset();
  }
	public saveWeight(formUsed): void {

    const newRequest = new LogWeight();
    newRequest.weight=this.weight;
    var date = moment(this.measurementDate, 'D-M-YYYY', true);
    newRequest.day= this.pipe.transform(date, 'yyyy-MM-dd');

  	const closeCallBack = () => {
			this.getAllWeights();
      formUsed.reset();

		};

  	this.weightService.storeWeight(newRequest,closeCallBack);
	}


}
