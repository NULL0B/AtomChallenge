export abstract class BaseAppError {
    specMessage: string;
    errorType: string;
    showToUser: boolean;
    protected constructor(message: string, errorType: string, showToUser = true) {
        this.specMessage = message;
        this.errorType = errorType;
        this.showToUser = showToUser;
    }
}