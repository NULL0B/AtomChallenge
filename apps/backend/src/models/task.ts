import { z } from "zod";

export const taskSchema = z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    status: z.enum(["open", "in progress", "done"]),
});

export type Task = z.infer<typeof taskSchema>;
