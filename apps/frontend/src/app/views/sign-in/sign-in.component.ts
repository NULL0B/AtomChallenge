import {Component, inject, signal} from "@angular/core";

import {ReactiveFormsModule, FormBuilder, Validators, FormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatSelectModule} from "@angular/material/select";
import {MatRadioModule} from "@angular/material/radio";
import {MatCardModule} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";
import {MatSlideToggle} from "@angular/material/slide-toggle";
import { AuthService } from "../../services/auth.service";


@Component({
    selector: "app-login",
    templateUrl: "./sign-in.component.html",
    styleUrl: "./sign-in.component.scss",
    standalone: true,
    imports: [
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatRadioModule,
        MatCardModule,
        ReactiveFormsModule,
        MatIcon,
        NgOptimizedImage,
        MatSlideToggle,
        FormsModule
    ]
})
export class SignInComponent {
    protected isRegistering = false;
    protected hidePass = true;
    protected loginError = signal<string | null>(null);
    private readonly _fb = inject(FormBuilder);
    private readonly _authService = inject(AuthService);
    private readonly _router = inject(Router);
    protected signInForm = this._fb.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required, Validators.minLength(8)]]
    });

    protected onSubmit(): void {
        this.loginError.set(null);
        if (this.isRegistering) {
            this._authService.register(String(this.signInForm.value.email),
                String(this.signInForm.value.password)).subscribe({
                next: () => {
                    this._router.navigate(["/"]);
                },
                error: (e) => {
                    this.loginError.set(e.message);
                }
            });
        } else {
            this._authService.login(String(this.signInForm.value.email),
                String(this.signInForm.value.password)).subscribe({
                next: () => {
                    this._router.navigate(["/"]);
                },
                error: (e) => {
                    this.loginError.set(e.message);
                }
            });
        }

    }
}
