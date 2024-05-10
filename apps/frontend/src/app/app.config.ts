import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { appRoutes } from "./app.routes";
import { connectAuthEmulator, getAuth, provideAuth } from "@angular/fire/auth";
import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { environment } from "../environments/environment";
import { authInterceptorProvider } from "./interceptors/auth.interceptor";
import { errorInterceptorProvider } from "./interceptors/error.interceptor";
import { unauthInterceptorProvider } from "./interceptors/unauth.interceptor";


export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withComponentInputBinding()),
        // Interceptors are provided in order: last to first being following the last one
        errorInterceptorProvider,
        unauthInterceptorProvider,
        authInterceptorProvider,
        // Node 18 constraint for SSR
        provideHttpClient(withFetch(), withInterceptorsFromDi()),
        provideAnimationsAsync(),
        importProvidersFrom(provideFirebaseApp(() => initializeApp(environment.firebaseConfig))),
        importProvidersFrom(provideAuth(() => {
            const auth = getAuth();
            if (environment.firebaseConfig.useEmulators) {
                connectAuthEmulator(auth, "http://localhost:9099");
            }
            return auth;
        }))
        // WILL NOT USE FIRESTORE, CALLABLES, ANALYTICS, ETC.
        // I WILL ONLY USE ANGULAR + AUTH in order to get to use more angular feat
        // importProvidersFrom(provideFirestore(() => {
        //     const firestore = getFirestore();
        //     if (environment.firebaseConfig.useEmulators) {
        //         connectFirestoreEmulator(firestore, "localhost", 8080);
        //     }
        //     return firestore;
        // })),
        // importProvidersFrom(provideFunctions(() => {
        //     const functions = getFunctions();
        //     if (environment.firebaseConfig.useEmulators) {
        //         connectFunctionsEmulator(functions, "localhost", 5001);
        //     }
        //     return functions;
        // }))
        // importProvidersFrom(provideAnalytics(() => getAnalytics())),
        // ScreenTrackingService,
        // UserTrackingService,
    ]
};
