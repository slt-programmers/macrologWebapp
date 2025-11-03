import { DecimalPipe } from '@angular/common';
import { Component, OnDestroy, OnInit, effect, inject, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Activity } from 'src/app/shared/model/activity';
import { UserService } from 'src/app/shared/services/user.service';
import { activitiesActions } from 'src/app/shared/store/actions/activities.actions';
import { selectActivitiesDate, selectActivitiesLoading } from 'src/app/shared/store/selectors/activities.selectors';
import { clone } from 'src/app/util/functions';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'ml-activity-page-row',
  templateUrl: './activity-page-row.component.html',
  styleUrls: ['./activity-page-row.component.scss'],
  imports: [ModalComponent, FormsModule, ReactiveFormsModule, DecimalPipe]
})
export class ActivityPageRowComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly store = inject(Store);
  private readonly formBuilder = inject(FormBuilder);

  readonly date = input.required<string>();

  public canSync = false;
  public activities: Activity[] = [];
  public modalActivities: Activity[] = []
  public showModal = false;
  public activityForm: FormGroup;

  private loading = false;
  private subscriptions: Subscription[] = [];
  private loadingSubscription?: Subscription;

  constructor() {
    this.activityForm = this.formBuilder.group({
      name: ['', Validators.required],
      calories: [undefined, Validators.required]
    });

    effect(() => {
      this.subscriptions.push(this.store.select(selectActivitiesDate(this.date())).subscribe(it => {
        this.activities = clone(it);
      }));
    })
  }

  ngOnInit(): void {
    this.getSyncSettings();
    this.loadingSubscription = this.store.select(selectActivitiesLoading).subscribe(it => {
      this.loading = it;
    });
  }

  syncActivities(): void {
    this.store.dispatch(activitiesActions.get(true, { date: this.date(), sync: true }));
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
      this.modalActivities.push({ ...data, day: this.date() });
      this.activityForm.reset();
    }
  }

  saveActivities() {
    this.store.dispatch(activitiesActions.post(this.modalActivities, this.date()));
    this.showModal = false;
    this.modalActivities = [];
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
