import { Request, Response } from "express";
import { inject } from "inversify";
import {
    controller, httpDelete, httpGet, httpPost, httpPut
} from "inversify-express-utils";
import {TasksService} from "../services/tasks.service";
import {taskSchema} from "../models/task";

@controller("/tasks")
export class TasksControllerV1 {
    constructor(@inject(TasksService) private tasksService: TasksService) {}

    @httpGet("/")
    public async getAllTasks(req: Request, res: Response): Promise<void> {
        const tasks = await this.tasksService.getAllTasks();
        res.json(tasks);
    }

    @httpPost("/")
    public async addTask(req: Request, res: Response): Promise<void> {
        // Validate the Task with zod
        const task =  taskSchema.parse(req.body);
        const newTask = await this.tasksService.addTask(task);
        res.json(newTask);
    }

    @httpPut("/:taskId")
    public async updateTask(req: Request, res: Response): Promise<void> {
        const updatedTask = await this.tasksService.updateTask(req.params["taskId"], req.body);
        res.json(updatedTask);
    }

    @httpDelete("/:taskId")
    public async deleteTask(req: Request, res: Response): Promise<void> {
        const deletedTask = await this.tasksService.deleteTask(req.params["taskId"]);
        res.json(deletedTask);
    }
}
