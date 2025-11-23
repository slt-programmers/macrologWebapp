import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ml-plans',
  imports: [],
  templateUrl: './plans.html'
})
export class Plans {
  private readonly router = inject(Router);

  openPlan(index: number) {
    this.router.navigate(['dashboard', 'plans', index])
  }
}
