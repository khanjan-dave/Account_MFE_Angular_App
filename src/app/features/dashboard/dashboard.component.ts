import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { User } from '../../core/models/user.model';
import { selectUser } from '../../store/auth/auth.selectors';
import { AuthActions } from '../../store/auth/auth.actions';
import { MaskAccountPipe } from '../../shared/pipes/mask-account.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MaskAccountPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);
  private router = inject(Router);

  user$: Observable<User | null> = this.store.select(selectUser);

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadAccountDetails());
  }

  goToTransfer(): void {
    // Shell-level navigation — Shell will load Transaction MFE here
    this.router.navigate(['/transactions']);
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
  }

  onLogout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
