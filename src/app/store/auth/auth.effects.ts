import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthActions } from './auth.actions';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((response) =>
            AuthActions.loginSuccess({ token: response.token, username: response.username }),
          ),
          catchError((error) =>
            of(
              AuthActions.loginFailure({
                error: error?.error?.message || 'Login failed. Please check your credentials.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  persistToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => localStorage.setItem('auth_token', token)),
      ),
    { dispatch: false },
  );

  loadAccountDetails$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess, AuthActions.restoreSession),
      exhaustMap(() =>
        this.authService.getAccountDetails().pipe(
          map((response) => AuthActions.loadAccountDetailsSuccess({ user: response.userDetails })),
          catchError((error) =>
            of(
              AuthActions.loadAccountDetailsFailure({
                error: error?.error?.message || 'Failed to load account details',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/dashboard'])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
