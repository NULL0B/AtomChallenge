import { z } from "zod";

export const taskSchema = z.object({
    id: z.string().optional(),
    title: z.string().default(""),
    description: z.string().default(""),
    completed: z.boolean().default(false),
    createdAt: z.date()
});

export type Task = z.infer<typeof taskSchema>;
