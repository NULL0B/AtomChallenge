import { Component, inject } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import {
    Router,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
} from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { mainSubViewsRoutes } from "./main-subviews.routes";

// I May convert this to an old ngModule in order to have child routes here, I like old way better
@Component({
    selector: "app-main-layout",
    templateUrl: "./main-layout.component.html",
    styleUrl: "./main-layout.component.scss",
    standalone: true,
    providers: [
    ],
    imports: [
        MatToolbarModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        AsyncPipe,
        RouterOutlet,
        NgOptimizedImage,
        RouterLinkActive,
        RouterLink,
        NgForOf,
        NgIf
    ]
})
export class MainLayoutComponent {
    protected readonly mainSubViewsRoutes = mainSubViewsRoutes;
    private readonly _breakpointObserver = inject(BreakpointObserver);
    isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );
    authService = inject(AuthService);
    router = inject(Router);
    get userName(): string{
        return this.authService.user()?.email?.split("@")[0] ?? "";
    }


    logout(): void {
        this.authService.logout().subscribe({
            next: () => {
                this.router.navigate(["/sign-in"]);
            }
        });
    }

}
