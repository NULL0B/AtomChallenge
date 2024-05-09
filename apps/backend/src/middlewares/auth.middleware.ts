// FirebaseAuthMiddleware.ts
import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin";
import { inject, injectable } from "inversify";
import {AuthMiddleware} from "../types/auth-base.middleware";

@injectable()
export class FirebaseAuthMiddleware implements AuthMiddleware {
    constructor(
        @inject(admin.app) private firebaseAdmin: admin.app.App,
    ) {
    }
    logger = console;
    async handle(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        this.logger.info("Check if request is authorized with Firebase ID token");

        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            this.logger.error(
                "No Firebase ID token was passed as a Bearer token in the Authorization header.",
                { structuredData: true }
            );
            res.status(403)
                .send("Unauthorized");
            return;
        }

        const idToken = req.headers.authorization.split("Bearer ")[1];
        try {
            await this.firebaseAdmin.auth()
                .verifyIdToken(idToken);
            this.logger.info("Firebase ID token verified successfully");
            next();
        } catch (error) {
            this.logger.error("Error while verifying Firebase ID token:", error);
            res.status(403)
                .send("Unauthorized");
        }
    }
}
