import {
	patchState,
	signalStore,
	withHooks,
	withMethods,
	withProps,
	withState,
} from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { inject } from "@angular/core";
import { AuthenticationService } from "../services/auth.service";
import { concatMap, map, pipe, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { UserAccount } from "../model/userAccount";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastService } from "../services/toast.service";

type AuthState = {
	isLoading: boolean;
	isAuthenticated: boolean;
	isAdmin: boolean;
	loginError: string;
	registerError: string;
	deleteError: string;
	changePasswordError: string;
	forgotEmailError: string;
};

const initialState: AuthState = {
	isLoading: false,
	isAuthenticated: false,
	isAdmin: false,
	loginError: "",
	registerError: "",
	deleteError: "",
	changePasswordError: "",
	forgotEmailError: ""
};

export const AuthenticationStore = signalStore(
	{ providedIn: "root" },
	withState(initialState),
	withProps(() => ({
		authService: inject(AuthenticationService),
		router: inject(Router),
		toastService: inject(ToastService),
	})),
	withMethods((store) => ({
		login: rxMethod<LoginRequest>(
			pipe(
				tap(() => {
					patchState(store, {
						isLoading: true,
						loginError: "",
						registerError: "",
					});
				}),
				concatMap((request: LoginRequest) => {
					return store.authService
						.login(request.usernameOrEmail, request.password)
						.pipe(
							tapResponse({
								next: (account: UserAccount) => {
									localStorage.setItem("currentUser", JSON.stringify(account));
									patchState(store, {
										isLoading: false,
										isAuthenticated: !!account.token,
										isAdmin: account.admin,
									});
									store.router.navigate(["dashboard"]);
								},
								error: (error: HttpErrorResponse) => {
									const loginError =
										error.status === 401 ||
										error.status === 403 ||
										error.status === 404
											? "Username or password incorrect"
											: error.message;
									patchState(store, { isLoading: false, loginError });
								},
							})
						);
				})
			)
		),
		register: rxMethod<RegisterRequest>(
			pipe(
				tap(() => {
					patchState(store, {
						isLoading: true,
						loginError: "",
						registerError: "",
					});
				}),
				concatMap((request: RegisterRequest) => {
					return store.authService
						.register(request.username, request.email, request.password)
						.pipe(
							tapResponse({
								next: (account: UserAccount) => {
									localStorage.setItem("currentUser", JSON.stringify(account));
								},
								error: (error: HttpErrorResponse) => {
									const registerError =
										error.status === 401
											? "Username or email already in use"
											: error.message;
									patchState(store, { isLoading: false, registerError });
								},
							}),
							map(() => {
								return request;
							})
						);
				}),
				concatMap((request: RegisterRequest) => {
					return store.authService
						.login(request.username, request.password)
						.pipe(
							tapResponse({
								next: (account: UserAccount) => {
									patchState(store, {
										isLoading: false,
										isAuthenticated: !!account.token,
										isAdmin: account.admin,
									});
									store.router.navigate(["dashboard", "onboarding"]);
								},
								error: (error: HttpErrorResponse) => {
									patchState(store, { isLoading: false, loginError: error.message });
								},
							})
						);
				})
			)
		),
		deleteAccount: rxMethod<string>(
			pipe(
				tap(() => {
					patchState(store, {
						isLoading: true,
						deleteError: "",
					});
				}),
				concatMap((password: string) => {
					return store.authService.deleteAccount(password).pipe(
						tapResponse({
							next: () => {
								localStorage.clear();
								patchState(store, {
									isAuthenticated: false,
									isAdmin: false,
									isLoading: false,
									deleteError: "",
								});
								store.router.navigate(["/"]);
							},
							error: (error: HttpErrorResponse) => {
								const deleteError =
									error.status === 401 ? "Password incorrect" : error.message;
								patchState(store, { isLoading: false, deleteError });
							},
						})
					);
				})
			)
		),
		changePassword: rxMethod<ChangePasswordRequest>(
			pipe(
				concatMap((request: ChangePasswordRequest) => {
					return store.authService
						.changePassword(
							request.oldPassword,
							request.newPassword,
							request.confirmPassword
						)
						.pipe(
							tapResponse({
								next: () => {
									store.toastService.setMessage(
										"Your password has changed",
										false,
										"Success!"
									);
								},
								error: (error: HttpErrorResponse) => {
									patchState(store, {
										changePasswordError: "Password invalid",
									});
								},
							})
						);
				})
			)
		),
		resetPassword: rxMethod<string>(
			pipe(
				concatMap((request: string) => {
					return store.authService.resetPassword(request).pipe(
						tapResponse({
							next: () => {
								store.toastService.setMessage(
									"We have send an email to reset your password.",
									false,
									"Success!"
								);
							},
							error: (error: HttpErrorResponse) => {
								patchState(store, {forgotEmailError: 'Emailadress was not found.'})
							},
						})
					);
				})
			)
		),
		logout() {
			patchState(store, {
				isLoading: false,
				isAuthenticated: false,
				isAdmin: false,
				loginError: "",
				registerError: "",
			});
			localStorage.removeItem("currentUser");
		},
	})),
	withHooks({
		onInit(store) {
			const storedUser = localStorage.getItem("currentUser");
			if (storedUser) {
				const formattedUser = JSON.parse(storedUser) as UserAccount;
				patchState(store, {
					isAuthenticated: true,
					isAdmin: formattedUser.admin,
				});
			}
		},
	})
);
