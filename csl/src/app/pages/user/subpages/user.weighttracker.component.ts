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
	templateUrl: './user.weighttracker.component.html',
	host: { '(document: click)': 'documentClick($event)' }
})
export class UserWeightTrackerComponent {

	private originalResult;

	public trackedWeights = new Array<LogWeight>();

	public measurementDate;
	public weight;
  public remark;

  public weightForm;

  public openWeight;

  private pipe: DatePipe;

	constructor(private userService: UserService,
              private weightService: WeightService,
							private toastService: ToastService) {

     this.getAllWeights();
     this.pipe = new DatePipe('en-US');
     this.init();
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

 public init(){
   this.measurementDate = moment().format('DD-MM-YYYY');

 }

 private compare(momentA, momentB) {
    if (momentA.isBefore(momentB)) return 1;
    else if (momentA.isAfter(momentB)) return -1;
    else return 0;
}

	public saveNewWeight(formUsed): void {

    const newRequest = new LogWeight();
    newRequest.weight=this.weight;
    var date = moment(this.measurementDate, 'D-M-YYYY', true);
    newRequest.day= this.pipe.transform(date, 'yyyy-MM-dd');
    newRequest.remark = this.remark;

  	const closeCallBack = () => {
      formUsed.reset();
			this.getAllWeights();
      this.init();
		};

  	this.weightService.storeWeight(newRequest,closeCallBack);
	}
  public editWeight(w){
    console.log('ee')
    if (this.openWeight) {
       if (this.openWeight.id === w.id) {
         // do nothing
         w.editable = true;
         console.log('already open')
       } else {
         //close previous
         this.openWeight.editable=false;
         this.initOpenWeight(w);
       }
    } else {
       this.initOpenWeight(w);
    }
  }

  private initOpenWeight(w){
         this.openWeight = w;
         // init new
         var date = moment(this.openWeight.day, 'YYYY-M-D', true);
         this.openWeight.dayString = this.pipe.transform( date, 'dd-MM-yyyy');
         this.openWeight.weightString = this.openWeight.weight;
         w.editable = true;
  }

  public deleteWeight(w){
    	const closeCallBack = () => {
			this.getAllWeights();
      this.openWeight = null;
      this.toastService.setMessage('Your weight measurement has been deleted!');
		};
    this.weightService.deleteWeight(w,closeCallBack);
  }

 public saveWeight(w){
    const closeCallBack = () => {
			this.getAllWeights();
      this.openWeight = null;
      this.toastService.setMessage('Your weight measurement has been updated!');
		};
    var date = moment(w.dayString, 'D-M-YYYY', true);
    w.day = this.pipe.transform( date, 'yyyy-MM-dd');
    w.weight = w.weightString;
    this.weightService.storeWeight(w,closeCallBack);
  }

  private documentClick(event) {
    console.log(event.target.classList)
		if (!event.target.classList.contains('weight__day') &&
		    !event.target.classList.contains('weight__weight') &&
		    !event.target.classList.contains('weight__remark') &&
        !event.target.classList.contains('editweight__day-input') &&
		    !event.target.classList.contains('editweight__weight-input') &&
		    !event.target.classList.contains('editweight__remark-input') &&
        !event.target.classList.contains('editweight__day') &&
		    !event.target.classList.contains('editweight__weight') &&
		    !event.target.classList.contains('editweight__remark') &&
		    !event.target.classList.contains('editweight')
		    ) {
      console.log('close')
      if (this.openWeight) {
         this.openWeight.editable=false;
      }
		}
	}
}
