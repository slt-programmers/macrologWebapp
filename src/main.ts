import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { enableProdMode, importProvidersFrom } from "@angular/core";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppRoutingModule } from "./app/app-routing.module";
import { AppComponent } from "./app/app.component";
import { ErrorInterceptor } from "./app/shared/interceptors/error.interceptor";
import { JwtInterceptor } from "./app/shared/interceptors/jwt.interceptor";
import { ServicesModule } from "./app/shared/services.module";
import { environment } from "./environments/environment";

if (environment.production) {
	enableProdMode();
}

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(
			BrowserModule,
			ServicesModule,
			AppRoutingModule,
			FontAwesomeModule
		),
		{ provide: Window, useValue: window },
		{ provide: Document, useValue: document },
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
		provideHttpClient(withInterceptorsFromDi()),
	],
}).catch((err) => console.error(err));
