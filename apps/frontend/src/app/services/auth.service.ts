import { inject, Injectable, OnDestroy, signal } from "@angular/core";
import {
    Auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword, signOut,
    updateProfile,
    User,
    user,
    UserCredential
} from "@angular/fire/auth";
import { from, Observable, ObservedValueOf, Subscription, take, tap } from "rxjs";
import { map } from "rxjs/operators";


@Injectable({
    providedIn: "root"
})
export class AuthService implements OnDestroy {
    firebaseAuth = inject(Auth);
    user$ = user(this.firebaseAuth);
    user = signal<User | null>(null);
    subscriptions = [] as Subscription[];

    constructor() {
        this.subscriptions.push(this.user$.subscribe(user => {
            this.user.set(user);
        }));
    }

    register(email: string, password: string): Observable<ObservedValueOf<Promise<UserCredential>>> {
        const promise = createUserWithEmailAndPassword(this.firebaseAuth, email, password);
        promise.then((userCredential) => {
            updateProfile(userCredential.user, { displayName: email });
        });
        return from(promise);
    }

    login(email: string, password: string): Observable<ObservedValueOf<Promise<UserCredential>>> {
        const promise = signInWithEmailAndPassword(this.firebaseAuth, email, password);
        return from(promise);
    }

    logout(): Observable<ObservedValueOf<Promise<void>>> {
        const promise = signOut(this.firebaseAuth);
        return from(promise);
    }

    isAuthenticated(): Observable<boolean> {
        return this.user$.pipe(
            take(1),
            map(user => !!user),
            tap(loggedIn => {
                return loggedIn;
            }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
}
