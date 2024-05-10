import { Routes } from "@angular/router";

export const mainSubViewsRoutes: Routes = [
    {
        path: "",
        redirectTo: "/tasks",
        pathMatch: "full"
    },
    {
        title: "My Tasks",
        path: "tasks",
        loadComponent: () => import("../../sub-views/tasks/tasks.component")
            .then((m) => m.TasksComponent)
    }
];