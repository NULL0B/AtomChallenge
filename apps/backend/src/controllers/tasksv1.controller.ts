import { Request, Response } from "express";
import { inject } from "inversify";
import {
    BaseHttpController,
    controller,
    httpDelete,
    httpGet,
    httpPost,
    httpPut
} from "inversify-express-utils";
import {
    StatusCodes
} from "http-status-codes";
import { TasksService } from "../services/tasks.service";
import { inputTaskDtoSchema } from "../dto/updateable-task.dto";
import { JsonResult } from "inversify-express-utils/lib/results";
import { pageSchema } from "../dto/page-params.dto";

@controller("/v1/tasks") //TYPES.AuthMiddleware
export class TasksControllerV1 extends BaseHttpController {
    constructor(
        @inject(TasksService) private readonly _tasksService: TasksService
    ) {
        super();
    }

    @httpGet("/")
    public async getAllTasks(_req: Request, _res: Response): Promise<JsonResult> {
        // parse the page opts from the query
        const pageOpts = pageSchema.parse(_req.query);
        const tasks = await this._tasksService
            .getAllTasks("createdAt", pageOpts.orderDir, pageOpts.lastId, pageOpts.itemsPerPage);
        // Will be using he below from inversify-express instead of express res.json(tasks);
        return this.json(tasks, StatusCodes.OK);
    }

    @httpPost("/")
    public async addTask(req: Request, res: Response): Promise<void> {
        // Validate the Task with zod
        const task = inputTaskDtoSchema.parse(req.body);
        const newTask = await this._tasksService.addTask(task);
        res.json(newTask);
    }

    @httpPut("/:taskId")
    public async updateTask(req: Request, res: Response): Promise<void> {
        const taskId = req.params["taskId"];
        const task = inputTaskDtoSchema.parse(req.body);
        const updatedTask = await this._tasksService.updateTask(taskId ,task);
        res.json(updatedTask);
    }

    @httpDelete("/:taskId")
    public async deleteTask(req: Request, res: Response): Promise<void> {
        const deletedTask = await this._tasksService.deleteTask(req.params["taskId"]);
        res.json(deletedTask);
    }
}
