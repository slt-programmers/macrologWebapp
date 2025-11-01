import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { Gender } from '../../../../shared/model/gender';
import { ToastService } from '../../../../shared/services/toast.service';
import { forkJoin } from 'rxjs';
import { UserSettings } from 'src/app/shared/model/userSettings';
import { format, parse } from 'date-fns';

@Component({
    selector: 'ml-personal',
    templateUrl: './personal.component.html',
    standalone: false
})
export class PersonalComponent implements OnInit {
  private originalResult?: UserSettings;

  public name?: string;
  public birthday?: string;
  public gender?: Gender;
  public height?: number;
  public weight?: number;
  public activity?: number;
  public newWeight?: number;

  public theme = 'light';

  constructor(private userService: UserService, private toastService: ToastService) {
    const theme = localStorage.getItem('theme');
    this.theme = theme ? theme : 'light';
    this.setThemeToDocument();
  }

  ngOnInit() {
    this.userService.getUserSettings().subscribe(
      (result) => {
        this.originalResult = result;
        this.name = result.name;
        this.birthday = result.birthday ? format(parse(result.birthday, 'yyyy-MM-dd', new Date()), 'dd-MM-yyyy') : undefined;
        this.gender = result.gender || Gender.Male;
        this.height = result.height;
        this.weight = result.currentWeight;
        this.activity = result.activity;
        this.newWeight = this.weight;
      }
    );
  }

  public setTheme(theme: string) {
    this.theme = theme;
    localStorage.setItem('theme', this.theme);
    this.setThemeToDocument();
  }

  public saveUserSettings(): void {
    forkJoin([
      this.userService.addUserSetting('name', this.name),
      this.userService.addUserSetting('birthday', this.birthday?.toString()),
      this.userService.addUserSetting('gender', this.gender?.toString()),
      this.userService.addUserSetting('height', this.height?.toString()),
      this.userService.addUserSetting('weight', this.weight?.toString()),
      this.userService.addUserSetting('activity', this.activity?.toString()),
    ]).subscribe(
      (data) => this.toastService.setMessage('Your data is saved!', false, 'Success!'),
      (error) => console.error(error)
    );
  }

  public isInputUnchanged(): boolean {
    if (this.originalResult !== undefined) {
      if (
        this.name === this.originalResult.name &&
        this.birthday === this.originalResult.birthday &&
        this.gender === this.originalResult.gender &&
        this.height === this.originalResult.height &&
        this.weight === this.originalResult.currentWeight &&
        this.activity === this.originalResult.activity
      ) {
        return true;
      }
    }
    return false;
  }

  private setThemeToDocument() {
    if (this.theme === 'light') {
      document.getElementsByTagName('body')[0].classList.remove('theme--dark');
    } else {
      document.getElementsByTagName('body')[0].classList.add('theme--dark');
    }
  }
}
