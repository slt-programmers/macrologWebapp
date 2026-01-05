import { DecimalPipe } from '@angular/common';
import { Component, effect, inject, input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSyncAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Activity } from 'src/app/shared/model/activity';
import { UserService } from 'src/app/shared/services/user.service';
import { ActivityStore } from 'src/app/shared/store/activity.store';
import { clone } from 'src/app/util/functions';
import { ModalComponent } from '../../../../shared/components/modal/modal.component';

@Component({
  selector: 'ml-activity-page-row',
  templateUrl: './activity-page-row.component.html',
  styleUrls: ['./activity-page-row.component.css'],
  imports: [ModalComponent, FormsModule, ReactiveFormsModule, DecimalPipe, FontAwesomeModule]
})
export class ActivityPageRowComponent implements OnInit {
  faTrash = faTrash;
  faSyncAlt = faSyncAlt;

  private readonly userService = inject(UserService);
  private readonly activityStore = inject(ActivityStore);
  private readonly formBuilder = inject(FormBuilder);

  readonly date = input.required<string>();

  private activitiesPerDay = this.activityStore.activitiesPerDay;

  activities: Activity[] = [];

  canSync = false;
  modalActivities: Activity[] = []
  showModal = false;
  activityForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    calories: [undefined, Validators.required]
  });

  constructor() {
    effect(() => {
      if (this.activitiesPerDay()) {
        this.activities = this.activityStore.filterDay(this.activitiesPerDay(), this.date())
      }
    });
  }

  ngOnInit(): void {
    this.getSyncSettings();
  }

  syncActivities(): void {
    this.activityStore.getActivitiesForDay({ date: this.date(), force: true })
  }

  showSync(): boolean {
    return this.canSync
  }

  openModal() {
    this.modalActivities = clone(this.activities)!;
    this.showModal = true;
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
    this.activityStore.postActivitiesForDay({ activities: this.modalActivities, date: this.date() });
    this.showModal = false;
    this.modalActivities = [];
  }

  private getSyncSettings(): void {
    this.userService.getSyncSettings('STRAVA').subscribe((result) => {
      if (result.syncedAccountId) {
        this.canSync = true;
      }
    });
  }
}
