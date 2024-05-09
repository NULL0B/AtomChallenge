import { NextFunction, Request, Response } from "express";

export interface AuthMiddleware {
    handle: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
}
