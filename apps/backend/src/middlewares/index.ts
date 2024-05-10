import { Container } from "inversify";
import { AuthorizeMiddleware } from "./auth.middleware";
import { TYPES } from "../types/ioc.types";

export const registerMiddlewares = (container: Container): void => {
    container.bind<AuthorizeMiddleware>(TYPES.AuthMiddleware).to(AuthorizeMiddleware).inRequestScope();
};