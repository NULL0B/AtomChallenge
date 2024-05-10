import { z } from "zod";
import { taskSchema } from "../models/task.model";


export const inputTaskDtoSchema = taskSchema.omit({ id: true, createdAt: true });

export type InputTaskDto = z.infer<typeof inputTaskDtoSchema>;
