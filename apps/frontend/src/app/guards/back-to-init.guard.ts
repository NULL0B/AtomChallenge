import { CanActivateChildFn, Router } from "@angular/router";
import { inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { AuthService } from "../services/auth.service";

export const backToInitGuard: CanActivateChildFn =
    async () => {
        const router = inject(Router);
        const isAuth = await firstValueFrom(inject(AuthService).isAuthenticated());
        if (isAuth) {
            await router.navigate(["/"]);
        }
        return true;
    };