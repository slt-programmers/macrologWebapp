import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/auth.service';
import { concatMap, pipe, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { UserAccount } from '../model/userAccount';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

type AuthState = {
  isLoading: boolean,
  isAuthenitcated: boolean,
  isAdmin: boolean,
  loginError: string,
  registerError: string
}

const initialState: AuthState = {
  isLoading: false,
  isAuthenitcated: false,
  isAdmin: false,
  loginError: '',
  registerError: ''
}

export const AuthenticationStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    authService: inject(AuthenticationService),
    router: inject(Router)
  })),
  withMethods((store) => ({
    login: rxMethod<LoginRequest>(pipe(
      tap(() => {
        patchState(store, { isLoading: true, loginError: '', registerError: '' })
      }),
      concatMap((request: LoginRequest) => {
        return store.authService.login(request.usernameOrEmail, request.password).pipe(tapResponse({
          next: (account: UserAccount) => {
            localStorage.setItem('currentUser', JSON.stringify(account));
            patchState(store, {
              isLoading: false,
              isAuthenitcated: !!account.token,
              isAdmin: account.admin
            });
            store.router.navigate(['dashboard']);
          },
          error: (error: HttpErrorResponse) => {
            const loginError = error.status === 401 || error.status === 403 || error.status === 404 ?
              'Username or password incorrect' : error.message;
            patchState(store, { isLoading: false, loginError });
          }
        }))
      })
    )),
    register: rxMethod<RegisterRequest>(pipe(
      tap(() => {
        patchState(store, { isLoading: true, loginError: '', registerError: '' })
      }),
      concatMap((request: RegisterRequest) => {
        return store.authService.register(request.username, request.email, request.password).pipe(tapResponse({
          next: (account: UserAccount) => {
          },
          error: (error: HttpErrorResponse) => {
            const registerError = error.status === 401 ? 'Username or email already in use' : error.message
            patchState(store, { isLoading: false, registerError });
          }
        }))
      }),
      concatMap((account: UserAccount) => {
        return store.authService.login(account.userName, 'test').pipe(tapResponse({
          next: (account: UserAccount) => {
            localStorage.setItem('currentUser', JSON.stringify(account));
            patchState(store, {
              isLoading: false,
              isAuthenitcated: !!account.token,
              isAdmin: account.admin
            });
            store.router.navigate(['dashboard', 'onboarding']);
          },
          error: (error: HttpErrorResponse) => {
            const loginError = error.status === 401 || error.status === 403 || error.status === 404 ?
              'Username or password incorrect' : error.message;
            patchState(store, { isLoading: false, loginError });
          }
        }))
      })
    ))
  }))
)