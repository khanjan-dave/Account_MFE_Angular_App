import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { User, LoginRequest } from '../../core/models/user.model';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ credentials: LoginRequest }>(),
    'Login Success': props<{ token: string; username: string }>(),
    'Login Failure': props<{ error: string }>(),
    'Load Account Details': emptyProps(),
    'Load Account Details Success': props<{ user: User }>(),
    'Load Account Details Failure': props<{ error: string }>(),
    'Restore Session': props<{ token: string }>(),

    Logout: emptyProps(),
  },
});
