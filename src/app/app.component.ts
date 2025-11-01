import { Component, OnInit } from '@angular/core';
import { HealthcheckService } from './shared/services/healthcheck.service';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
    selector: 'ml-root',
    templateUrl: './app.component.html',
    imports: [RouterOutlet, ToastComponent]
})
export class AppComponent implements OnInit {

  private asleep = true;
  private theme: string;

  constructor(private readonly healthcheckService: HealthcheckService,
    private readonly document: Document) { }

  ngOnInit(): void {
    this.healthcheck();
    this.setTheme();
  }

  private setTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.document.getElementsByTagName('body')[0].classList.add('theme--dark');
    }
  }

  private healthcheck() {
    this.healthcheckService.checkState().subscribe(
      (result) => {
        this.asleep = !result;
      },
      (error) => {
        if (error.status === 403) {
          this.asleep = !error;
        }
      }
    );
  }

  isAsleep(): boolean {
    return this.asleep;
  }
}
