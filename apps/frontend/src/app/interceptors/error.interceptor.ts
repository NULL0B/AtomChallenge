import { inject, Injectable, Provider } from "@angular/core";
import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";
import { JsonPipe } from "@angular/common";
import { nameof } from "../utils/typing";
import { BaseAppError } from "../types/base-app.error";


const isBaseError = (obj: unknown): obj is BaseAppError => {
    if (obj !== null || typeof obj === "object") {
        return nameof<BaseAppError>("showToUser") in (obj as object)
            && nameof<BaseAppError>("specMessage") in (obj as object);
    }
    return false;
};

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    snackBar = inject(MatSnackBar);
    router = inject(Router);

    jsonPipe = new JsonPipe();

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                const errorData = err.error as unknown;
                if (isBaseError(errorData) && errorData.showToUser) {
                    this.snackBar.open(errorData.specMessage, "Close");
                    return throwError(() => err);
                }
                this.snackBar.open(
                    `Unkonwn Error: ${err.message}. Info=${this.jsonPipe.transform(err.error)}`,
                    "Close");
                return throwError(() => err);
            })
        );
    }
}

export const errorInterceptorProvider: Provider =
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true };