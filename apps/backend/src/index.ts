// Let's import reflect-metadata at the very beginning of our application, do not remove this line
import "reflect-metadata";

import admin from "firebase-admin";
import { onRequest } from "firebase-functions/v2/https";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";
import { logger } from "firebase-functions";
import { registerServices } from "./services";
import { registerMiddlewares } from "./middlewares";
import { Logger } from "./types/logger";
import bodyParser from "body-parser";
import { TYPES } from "./types/ioc.types";
import { provideGlobalCfgMiddleware } from "./utils/inversify-express.utils";
import { FirebaseAuthProvider } from "./configs/inversify-express-auth-provider";
// Import all in the controllers folder to make sure all controllers are registered
import "./controllers";
import { errorConfigHandler } from "./configs/inversify-express-error-handler";
import { AppStatusInformer } from "./utils/app-status-informer";
// YAGNI: We are using firebase hosting proxy to serve the API, so we don't need CORS
// import cors from "cors";

// Create the base instances
const container = new Container();
const firebaseApp = admin.initializeApp();
const appStatusInformer = new AppStatusInformer();
const inversifyExpress = new InversifyExpressServer(
    container,
    null,
    { rootPath: "/api" },
    null,
    FirebaseAuthProvider,
    true);


// Config base constants and config in the container
container.bind<AppStatusInformer>(TYPES.AppStatus).toConstantValue(appStatusInformer);
container.bind<admin.app.App>(admin.app).toConstantValue(firebaseApp);
container.bind<admin.firestore.Firestore>(TYPES.Firestore).toConstantValue(firebaseApp.firestore());
container.bind<Logger>(TYPES.Logger).toConstantValue(logger);
// Register all services and middlewares
registerServices(container);
registerMiddlewares(container);

// Set the express/inversify-express global configs
inversifyExpress.setConfig((expressApp) => {
    // Add middleware to enable CORS if needed
    // YAGNI: We are using firebase hosting proxy to serve the API, so we don't need CORS
    // expressApp.use(cors({ origin: true }));

    // Add body parser configs
    expressApp.use(bodyParser.urlencoded({ extended: true }));
    expressApp.use(bodyParser.json());

    // Add global Auth middleware for all controllers
    expressApp.use(provideGlobalCfgMiddleware(inversifyExpress, TYPES.AuthMiddleware));
});

inversifyExpress.setErrorConfig(errorConfigHandler);

const app = inversifyExpress.build();
appStatusInformer.markAsInitialized();
export const api = onRequest(app);
