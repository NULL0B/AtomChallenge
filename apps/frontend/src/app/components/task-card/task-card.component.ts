import {
    Component,
    EventEmitter,
    inject,
    Input, OnChanges,
    OnInit,
    Output, SimpleChanges, ViewChild
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from "@angular/material/card";
import { MatFormField } from "@angular/material/form-field";
import { MatMenu, MatMenuItem, MatMenuTrigger } from "@angular/material/menu";
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from "@angular/material/button";
import { MatInput } from "@angular/material/input";
import { Task } from "../../models/task";
import { coerceNumberProperty, NumberInput } from "@angular/cdk/coercion";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatCheckbox } from "@angular/material/checkbox";
import { FormsModule, NgForm } from "@angular/forms";
import { MatChip, MatChipSet } from "@angular/material/chips";
import { debounceTime } from "rxjs/operators";
import { Subscription } from "rxjs";
import { TasksService } from "../../services/tasks.service";
import { MatGridTile } from "@angular/material/grid-list";

@Component({
    selector: "app-task-card",
    standalone: true,
    imports: [
        CommonModule,
        MatCard,
        MatCardHeader,
        MatFormField,
        MatCardTitle,
        MatCardContent,
        MatMenuItem,
        MatIcon,
        MatMenu,
        MatMenuTrigger,
        MatIconButton,
        MatInput,
        MatProgressBar,
        MatCheckbox,
        FormsModule,
        MatCardFooter,
        MatChip,
        MatChipSet,
        MatGridTile
    ],
    templateUrl: "./task-card.component.html",
    styleUrl: "./task-card.component.scss"
})
export class TaskCardComponent implements OnInit, OnChanges {


    @Input({ required: true }) task!: Task;
    @Input({ required: true }) maxCols!: NumberInput;
    @Input() wrapped = false;
    @Output() taskChange = new EventEmitter<Task | null>();
    @Output() cardResized = new EventEmitter<void>();
    @ViewChild("taskForm", { read: NgForm, static: true }) taskForm!: NgForm;
    protected readOnly = true;
    protected loading = true;
    public cols: NumberInput = 1;
    public rows: NumberInput = 1;
    subscriptions: Subscription[] = [];
    private readonly _tasksService = inject(TasksService);


    ngOnInit(): void {
        if (this.taskForm?.valueChanges) {
            // debounce the form changes
            this.subscriptions.push(this.taskForm.valueChanges.pipe(debounceTime(600)).subscribe((task: Task) => {
                if (this.taskForm.dirty) {
                    this.loading = true;
                    const toUpdateTask = { ...this.task, ...task };
                    this._tasksService.updateTask(toUpdateTask).subscribe((updatedTask) => {
                        this.taskForm.control.reset(updatedTask, { emitEvent: false });
                        this.taskChange.emit(updatedTask);
                        this.readOnly = updatedTask.completed;
                        setTimeout(() => {
                            this.loading = false;
                        }, 400);
                    });
                }
            }
            ));
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // React to changes in the wrapped property
        if (changes["wrapped"] !== undefined) {
            if (changes["wrapped"].currentValue) {
                this.cols = coerceNumberProperty(this.maxCols);
                this.rows = 4;
            } else {
                this.cols = 1;
                this.rows = 3;
            }
            this.cardResized.emit();
        }

        // React to changes in the task property
        const task = changes["task"].currentValue as Task;
        if (task?.id) {
            this.loading = false;
            this.readOnly = task.completed;
        } else {
            this.loading = true;
            this.readOnly = true;
            this._tasksService.createTask(task).subscribe((newTask) => {
                this.taskForm.control.reset(newTask, { emitEvent: false });
                this.taskChange.emit(newTask);
                this.readOnly = newTask.completed;
                setTimeout(() => {
                    this.loading = false;
                }, 400);
            });
        }
    }

    deleteTask(): void {
        this._tasksService.deleteTask(this.task.id).subscribe(() => {
            this.taskChange.emit(null);
        }
        );
    }
}
