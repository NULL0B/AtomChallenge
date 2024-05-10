import { interfaces } from "inversify-express-utils";
import admin from "firebase-admin";

export class FirebasePrincipal implements interfaces.Principal {
    public details: admin.auth.DecodedIdToken | null;

    public constructor(details: admin.auth.DecodedIdToken | null) {
        this.details = details;
    }

    public isAuthenticated(): Promise<boolean> {
        return Promise.resolve(this.details !== null);
    }

    public isResourceOwner(_resourceId: unknown): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    public isInRole(_role: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}