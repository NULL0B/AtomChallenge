import { Component, OnInit, inject, ViewChild, ChangeDetectorRef } from "@angular/core";
import { AsyncPipe, NgIf } from "@angular/common";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatError, MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { Task } from "../../models/task";
import { TaskCardComponent } from "../../components/task-card/task-card.component";
import { MatTooltip } from "@angular/material/tooltip";
import { TasksService } from "../../services/tasks.service";
import {
    zoomInOnEnterAnimation, zoomOutOnLeaveAnimation
} from "angular-animations";
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { map } from "rxjs/operators";
import { nameof } from "../../utils/typing";

@Component({
    animations: [
        zoomInOnEnterAnimation({ anchor: "enter", duration: 500 }),
        zoomOutOnLeaveAnimation({ anchor: "leave", duration: 500 })
    ],
    imports: [
        AsyncPipe,
        MatGridListModule,
        MatMenuModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        FormsModule,
        MatError,
        MatFormField,
        MatInput,
        ReactiveFormsModule,
        TaskCardComponent,
        MatTooltip,
        NgIf,
        CdkVirtualScrollViewport,
        CdkVirtualForOf,
        CdkFixedSizeVirtualScroll
    ],
    selector: "app-tasks",
    standalone: true,
    styleUrl: "./tasks.component.scss",
    templateUrl: "./tasks.component.html"
})
export class TasksComponent implements OnInit {
    private readonly _breakpointObserver = inject(BreakpointObserver);
    protected wrapped = false;
    cd = inject(ChangeDetectorRef);

    trackById(_index: number, task: Task): string {
        return task.id;
    }

    ngOnInit(): void {
        this._breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Handset]).pipe(
            map(({ matches }) => {
                this.wrapped = matches;
            })
        ).subscribe();

        this._loading = true;
        this._tasksService.getTasks().subscribe((tasks) => {
            this.tasks = tasks;
            this._loading = false;
        });

    }

    private readonly _tasksService = inject(TasksService);
    protected tasks = [] as Task[];
    private _loading = false;

    addTask(): void {
        this.tasks = [{ title: "", description: "" } as Task, ...this.tasks];
    }

    @ViewChild(CdkVirtualScrollViewport) scroll!: CdkVirtualScrollViewport;

    lazyLoadNewTasks(): void {
        const end = this.scroll.getRenderedRange().end;
        if (!this._loading && end === this.tasks.length - 1) {
            this._loading = true;
            const lastTask = this.tasks[this.tasks.length - 1];
            this._tasksService.getTasks(nameof<Task>("createdAt"), "desc", lastTask?.id)
                .subscribe((tasks) => {
                    this.tasks = [...this.tasks, ...tasks];
                    this._loading = false;
                });
        }
    }

    updateTaskList(previousTask: Task, newTask: Task | null): void {
        const index = this.tasks.indexOf(previousTask);
        if (newTask === null) {
            this.tasks = this.tasks.filter((task) => task !== previousTask);
            return;
        }
        Object.assign(this.tasks[index], newTask);
        this.tasks = [...this.tasks];

    }

    cardResized(): void {
        this.cd.detectChanges();
    }
}
