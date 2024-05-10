import { BaseAppError } from "./base.error";

export class NotFoundError extends BaseAppError {
    constructor(message: string,showToUser = true) {
        super(message, "NotFoundError", showToUser);
    }
}