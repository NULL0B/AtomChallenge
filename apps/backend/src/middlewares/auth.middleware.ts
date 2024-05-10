import { injectable } from "inversify";
import { BaseMiddleware } from "inversify-express-utils";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

@injectable()
export class AuthorizeMiddleware extends BaseMiddleware {
    handler(_req: Request, res: Response, next: NextFunction): void {
        if(!this.httpContext?.user) {
            res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized - Error: User not found in the request context.");
            return;
        }
        this.httpContext.user.isAuthenticated().then((isAuthenticated) => {
            if (isAuthenticated) {
                next();
            } else {
                res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
            }
        });
    }

}

