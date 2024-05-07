/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as logger from "firebase-functions/logger";
import {onRequest} from "firebase-functions/v2/https";

import express from "express";
import cors from "cors";

const app = express();
app.use(cors({origin: true}));

// middleware to log all requests
app.use((req, res, next) => {
  logger.error("Request received", {structuredData: true});
  // res.send("Hello from Firebase!");
  next();
});
app.get("/api/hello", (req, res) => {
  // json
  res.json({message: "Hello from Firebase 2!"});
});

export const api = onRequest(app);




// export const api = onRequest(app);


// exports.api = onRequest((request, response) => {
//   console.log('I am a log entry!');
//   logger.error("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
