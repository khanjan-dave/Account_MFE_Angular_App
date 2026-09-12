import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../../core/models/user.model';
import { AuthActions } from './auth.actions';

export const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
    isAuthenticated: false,
  })),

  on(AuthActions.loadAccountDetailsSuccess, (state, { user }) => ({
    ...state,
    user,
  })),

  on(AuthActions.restoreSession, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: true,
  })),

  on(AuthActions.logout, () => initialState),
);
