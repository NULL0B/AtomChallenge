import { Application, NextFunction, Request, Response } from "express";
import { BusinessError } from "../types/exceptions/business.error";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../types/exceptions/not-found.error";

export function errorConfigHandler(app: Application): void {
    app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
        if (err instanceof BusinessError) {
            res.status(StatusCodes.BAD_REQUEST).json(err);
            return;
        }
        if (err instanceof NotFoundError) {
            res.status(StatusCodes.NOT_FOUND).json(err);
            return;
        }
        if (err instanceof Error) {
            // TODO: Filter this better maybe?
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err);
            return;
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("Unknown error");
    });
}