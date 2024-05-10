import { z } from "zod";

export const pageSchema = z.object({
    orderField: z.string().optional(),
    orderDir: z.enum(["asc", "desc"]).optional(),
    lastId: z.string().optional(),
    itemsPerPage: z.preprocess(
        (a) => parseInt(z.string().parse(a), 10),
        z.number().positive().optional().default(16))
});

export type PageParams = z.infer<typeof pageSchema>;