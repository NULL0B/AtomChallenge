import { NextFunction, Request, RequestHandler, Response } from "express";
import { BaseMiddleware, HttpContext, InversifyExpressServer } from "inversify-express-utils";
import { interfaces } from "inversify";


/**
 * Allows providing an inversify-express BaseMiddleware as a global middleware in the global configuration.
 * Bypassing the limitation of the Inversify design.
 *
 * *NOTE*: This function is intended to be used only inside the global configuration function
 * of the InversifyExpressServer.
 * @param inversifyExp InversifyExpressServer instance
 * @param middlewareIdentifier Identifier of the middleware to resolve from the container
 * @returns RequestHandler
 */
export function provideGlobalCfgMiddleware(
    inversifyExp: InversifyExpressServer,
    middlewareIdentifier: interfaces.ServiceIdentifier<BaseMiddleware>
): RequestHandler {
    const invExpressContainer = Reflect.get(inversifyExp, "_container") as interfaces.Container;
    const inversifyGetHttpContextFn = Reflect.get(inversifyExp, "_getHttpContext") as (req: Request) => HttpContext;

    if (!invExpressContainer || !inversifyGetHttpContextFn) {
        throw new Error("InversifyExpressServer instance is not properly initialized");
    }

    if (!invExpressContainer.isBound(middlewareIdentifier)) {
        throw new Error(`Middleware ${middlewareIdentifier.toString()} is not bound to the container`);
    }
    const middlewareForValidation = invExpressContainer.get<unknown>(middlewareIdentifier);

    if (!(middlewareForValidation instanceof BaseMiddleware)) {
        throw new Error(`Middleware ${middlewareIdentifier.toString()} is not an instance of BaseMiddleware`);
    }

    return (req: Request, res: Response, next: NextFunction): void => {
        const middlewareInst = invExpressContainer.get<BaseMiddleware>(middlewareIdentifier);
        middlewareInst.httpContext = inversifyGetHttpContextFn(req);
        middlewareInst.handler(req, res, next);
    };
}