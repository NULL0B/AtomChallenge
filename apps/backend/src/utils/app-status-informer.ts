import { environment } from "../environments/environment";

/**
 * InversifyExpressServer instance initilices the contollers and services when is being created.
 * This class is used to inform about the status of the application with enums. So they can act accordingly.
 */
export class AppStatusInformer {

    public readonly isDev = !environment.production;
    private _isInitialized = false;

    markAsInitialized(): void {
        this._isInitialized = true;
    }

    isInitialized(): boolean {
        return this._isInitialized;
    }

}
