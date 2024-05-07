import { ApplicationConfig, importProvidersFrom, isDevMode } from "@angular/core";
import { initializeApp, provideFirebaseApp } from "@angular/fire/app";
import { connectFirestoreEmulator, getFirestore, provideFirestore } from "@angular/fire/firestore";
import { connectFunctionsEmulator, getFunctions, provideFunctions } from "@angular/fire/functions";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import {connectAuthEmulator, getAuth, provideAuth} from "@angular/fire/auth";

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimationsAsync(),
        importProvidersFrom(provideFirebaseApp(() => initializeApp({
            projectId: "groovy-gearbox-422522-b1",
            appId: "1:374640141208:web:f9402de0642198c4a181ed",
            storageBucket: "groovy-gearbox-422522-b1.appspot.com",
            apiKey: "AIzaSyC_2EM7RwKy5G39f6XHseepLmBJVaIEvzE",
            authDomain: "groovy-gearbox-422522-b1.firebaseapp.com",
            messagingSenderId: "374640141208",
            measurementId: "G-8FK2Q3TP9W"
        }))),
        // importProvidersFrom(provideAnalytics(() => getAnalytics())),
        // ScreenTrackingService,
        // UserTrackingService,
        importProvidersFrom(provideAuth(() => {
            const auth = getAuth();
            if (isDevMode()) {
                connectAuthEmulator(auth, "http://localhost:9099");
            }
            return auth;
        })),
        importProvidersFrom(provideFirestore(() => {
            const firestore = getFirestore();
            if (isDevMode()) {
                connectFirestoreEmulator(firestore, "localhost", 8080);
            }
            return firestore;
        })),
        importProvidersFrom(provideFunctions(() => {
            const functions = getFunctions();
            if (isDevMode()) {
                connectFunctionsEmulator(functions, "localhost", 5001);
            }
            return functions;
        }))]
};
