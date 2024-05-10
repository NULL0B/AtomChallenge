import { Container } from "inversify";
import { TasksService } from "./tasks.service";

export const registerServices = (container: Container): void => {
    container.bind<TasksService>(TasksService).toSelf().inRequestScope();
};