import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'ml-admin-page',
  templateUrl: './admin.component.html',
  imports: [RouterLink, RouterOutlet]
})
export class AdminComponent {
  router = inject(Router);

  isAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
    return (currentUser && currentUser.admin);
  }
}
