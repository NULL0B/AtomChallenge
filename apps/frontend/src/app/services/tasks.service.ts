import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Task } from "../models/task";
import { Observable } from "rxjs";
import { PageParams } from "../types/page-params.type";
import { nameof } from "../utils/typing";

@Injectable({
    providedIn: "root"
})
export class TasksService {

    private readonly _baseUrl = "/api/v1/tasks";
    http = inject(HttpClient);

    getTasks(orderField = nameof<Task>("createdAt"),
        orderDir: "asc" | "desc" = "desc",
        lastId: string| null = null): Observable<Task[]> {
        const params: PageParams = {
            orderField,
            orderDir,
            itemsPerPage: 16
        };
        if (lastId) {
            params.lastId = lastId;
        }
        return this.http.get<Task[]>(this._baseUrl, {
            params: params
        });
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this._baseUrl, task);
    }

    updateTask(task: Task): Observable<Task> {
        return this.http.put<Task>(`${this._baseUrl}/${task.id}`, task);
    }

    deleteTask(taskId: string): Observable<void> {
        return this.http.delete<void>(`${this._baseUrl}/${taskId}`);
    }


}

