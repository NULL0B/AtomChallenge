import { inject, Injectable, Provider } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { from, mergeMap, Observable } from "rxjs";
import { switchMap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    authService = inject(AuthService);

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.authService.user$.pipe(
            switchMap(user => {
                if (user) {
                    return from(user.getIdToken()).pipe(
                        mergeMap(token => {
                            const clonedReq = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${token}`
                                }
                            });
                            return next.handle(clonedReq);
                        })
                    );
                }
                return next.handle(req);
            })
        );
    }
}

export const authInterceptorProvider: Provider =
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true };