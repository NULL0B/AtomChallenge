import { inject, Injectable, Provider } from "@angular/core";
import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { catchError, Observable, of, throwError } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { StatusCodes } from "http-status-codes";

@Injectable()
export class UnAuthInterceptor implements HttpInterceptor {
    authService = inject(AuthService);
    router = inject(Router);

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse): Observable<never> => {
                if (err.status === StatusCodes.UNAUTHORIZED || err.status === StatusCodes.FORBIDDEN) {
                    this.authService.logout().subscribe({
                        next: () => {
                            this.router.navigate(["/sign-in"]);
                        }
                    });
                    // Swallow the error and stop the chain
                    return of();
                }
                return throwError(() => err);
            })
        );
    }
}

export const unauthInterceptorProvider: Provider =
    { provide: HTTP_INTERCEPTORS, useClass: UnAuthInterceptor, multi: true };