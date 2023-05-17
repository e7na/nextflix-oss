import express, { Express } from "express";
import api from "../routes/index.js";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import { config } from "dotenv";
import { validateAccessToken } from "./middlewares.js";
import { authenticatedRequest } from "./types.js";
config();
import "../strategies/discord.js";
import "../strategies/google.js";
import "../strategies/local.js";

export default function createApp(): Express {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(
    cors({
      origin: [
        `http://localhost:${process.env.BACKEND_PORT}`,
        `http://localhost:${process.env.FRONTEND_PORT}`,
      ],
      credentials: true,
    })
  );

  app.use(passport.initialize());
  app.use("/api", api);
  // app.use("/api", routes);

  // these bad routes are for auh testing and i'll remove them when everything works smoothly
  // app.get("/", validataUser, (req: authenticatedRequest, res) =>
  //   res.send({ msg: `3aaaaaaaaaaaaaaaaaaaaaaaaa4 ya ${req.userData["name"]}` })
  // );
  // app.use("/", validateAccessToken, (req: authenticatedRequest, res) =>
  //   res.send({ msg: `3aaaaaaaaaaaaaaaaaaaaaaaaa4 ya ${req.userData["name"]}` })
  // );
  return app;
}
