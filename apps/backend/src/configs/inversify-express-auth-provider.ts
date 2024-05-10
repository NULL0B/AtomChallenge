import { inject, injectable } from "inversify";
import { interfaces } from "inversify-express-utils";
import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { Logger } from "../types/logger";
import { TYPES } from "../types/ioc.types";
import { FirebasePrincipal } from "../types/firebase-principal";

// Remember to set your Cloud Run functions public and leverage this to secure the endpoints
const firebaseAdmin = inject(admin.app);
const logger = inject(TYPES.Logger);

@injectable()
export class FirebaseAuthProvider implements interfaces.AuthProvider {
    @firebaseAdmin private readonly _firebaseAdmin!: admin.app.App;
    @logger private readonly _logger!: Logger;

    public async getUser(
        req: Request,
        _res: Response,
        _next: NextFunction
    ): Promise<FirebasePrincipal> {

        this._logger.info("Check if request is authorized with Firebase ID token");

        if (!req.headers.authorization?.startsWith("Bearer ")) {
            this._logger.error(
                "No Firebase ID token was passed as a Bearer token in the Authorization header.",
                { structuredData: true }
            );
            return new FirebasePrincipal(null);
        }

        const idToken = req.headers.authorization.split("Bearer ")[1];
        try {
            const user = await this._firebaseAdmin.auth().verifyIdToken(idToken);
            this._logger.info("Firebase ID token verified successfully");
            return new FirebasePrincipal(user);
        } catch (error) {
            this._logger.error("Error while verifying Firebase ID token:", error);
            return new FirebasePrincipal(null);
        }

    }

}