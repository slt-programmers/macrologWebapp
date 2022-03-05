import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { clone } from 'src/app/util/functions';
import { Activity } from 'src/app/shared/model/activity';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectActivitiesDate, selectActivitiesLoading } from 'src/app/shared/store/selectors/activities.selectors';
import { activitiesActions } from 'src/app/shared/store/actions/activities.actions';

@Component({
  selector: 'ml-activity-page-row',
  templateUrl: './activity-page-row.component.html',
  styleUrls: ['./activity-page-row.component.scss']
})
export class ActivityPageRowComponent implements OnInit, OnChanges, OnDestroy {

  @Input() date: string;

  public canSync = false;
  public activities: Activity[] = [];
  public modalActivities: Activity[];
  public showModal = false;
  public activityForm: FormGroup;

  private loading = false;
  private subscriptions: Subscription[] = [];
  private loadingSubscription: Subscription;

  constructor(private readonly userService: UserService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder) {
    this.activityForm = this.formBuilder.group({
      name: ['', Validators.required],
      calories: [undefined, Validators.required]
    });
  }

  ngOnInit(): void {
    this.getSyncSettings();
    this.loadingSubscription = this.store.select(selectActivitiesLoading).subscribe(it => {
      this.loading = it;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.subscriptions.push(this.store.select(selectActivitiesDate(this.date)).subscribe(it => {
      this.activities = clone(it);
    }));
  }

  syncActivities(): void {
    this.store.dispatch(activitiesActions.get(true, { date: this.date, sync: true }));
  }

  showSync(): boolean {
    return this.canSync && !this.loading
  }

  openModal() {
    if (!this.loading) {
      this.modalActivities = clone(this.activities);
      this.showModal = true;
    }
  }

  changeName(event: any, index: number): void {
    this.modalActivities[index].name = event.target.value;
  }

  changeCalories(event: any, index: number): void {
    this.modalActivities[index].calories = +event.target.value;
  }

  deleteActivity(index: number) {
    this.modalActivities.splice(index, 1);
  }

  addActivity() {
    this.activityForm.markAllAsTouched();
    if (this.activityForm.valid) {
      const data = this.activityForm.value;
      this.modalActivities.push({ ...data, day: this.date });
      this.activityForm.reset();
    }
  }

  saveActivities() {
    this.store.dispatch(activitiesActions.post(this.modalActivities, this.date));
    this.showModal = false;
    this.modalActivities = undefined;
  }

  ngOnDestroy(): void {
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  private getSyncSettings(): void {
    this.userService.getSyncSettings('STRAVA').subscribe((result) => {
      if (result.syncedAccountId) {
        this.canSync = true;
      }
    });
  }
}
