import { CanActivateChildFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../services/auth.service";

export const canActivateAuthGuard: CanActivateChildFn =
    async () => {
        const router = inject(Router);
        const isAuth = await firstValueFrom(inject(AuthService).isAuthenticated());
        if (!isAuth) {
            await router.navigate(["/sign-in"]);
        }
        return isAuth;
    };
