import { Component, OnInit, inject } from '@angular/core';
import { HealthcheckService } from './shared/services/healthcheck.service';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'ml-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, ToastComponent]
})
export class AppComponent implements OnInit {
  private readonly healthcheckService = inject(HealthcheckService);
  private readonly title = inject(Title);
  private readonly document = inject(Document);

  private asleep = true;

  ngOnInit(): void {
    this.title.setTitle(environment.title)
    this.healthcheck();
    this.setTheme();
  }

  isAsleep(): boolean {
    return this.asleep;
  }

  private setTheme() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      this.document.getElementsByTagName('body')[0].classList.add('theme--dark');
    }
  }

  private healthcheck() {
    this.healthcheckService.checkState().subscribe({
      next:
        (result) => {
          this.asleep = !result;
        },
      error:
        (error) => {
          if (error.status === 403) {
            this.asleep = !error;
          }
        }
    });
  }


}
