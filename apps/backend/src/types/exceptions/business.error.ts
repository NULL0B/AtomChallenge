import { BaseAppError } from "./base.error";

export class BusinessError extends BaseAppError {
    constructor(message: string,showToUser = true) {
        super(message, "BusinessError", showToUser);
    }
}