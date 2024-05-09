// Let's import reflect-metadata at the very beginning of our application, do not remove this line
import "reflect-metadata";

import cors from "cors";
import admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import {AuthMiddleware} from "./types/auth-base.middleware";
import {FirebaseAuthMiddleware} from "./middlewares/auth.middleware";
import {TasksService} from "./services/tasks.service";
import {TYPES} from "./types/ioc";


// Import all in the controllers folder to make sure all controllers are registered
import "./controllers";


const container = new Container();
const firebaseApp = admin.initializeApp();
container.bind<admin.app.App>(admin.app)
    .toConstantValue(firebaseApp);
container.bind<admin.firestore.Firestore>(TYPES.Firestore).toConstantValue(firebaseApp.firestore());
container.bind<AuthMiddleware>(TYPES.AuthMiddleware).to(FirebaseAuthMiddleware);


container.bind<TasksService>(TasksService)
    .toSelf();

const inversifyExpress = new InversifyExpressServer(container, null, { rootPath: "/api" });
inversifyExpress.setConfig((expressApp) => {
    // Add middleware to enable CORS
    expressApp.use(cors({ origin: true }));
    // Add middleware to authenticate requests with Firebase Auth before letting the request through
    // const authMiddleware = container.get<AuthMiddleware>(TYPES.AuthMiddleware);
    // expressApp.use(authMiddleware.handle.bind(authMiddleware));
});

export const api = onRequest(inversifyExpress.build());
