import { Routes } from "@angular/router";
import { backToInitGuard } from "./guards/back-to-init.guard";
import { canActivateAuthGuard } from "./guards/can-activate.guard";


export const appRoutes: Routes = [

    {
        path: "sign-in",
        loadComponent: () => import("./views/sign-in/sign-in.component").then((m) => m.SignInComponent),
        canActivate: [backToInitGuard]
    },
    {
        path: "",
        loadComponent: () => import("./views/main-layout/main-layout.component").then((m) => m.MainLayoutComponent),
        canActivate: [canActivateAuthGuard],
        loadChildren: () => import("./views/main-layout/main-subviews.routes").then((m) => m.mainSubViewsRoutes)
    },
    {
        path: "**",
        redirectTo: "/tasks"
    }];
