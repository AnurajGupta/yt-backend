import dotenv from "dotenv";
dotenv.config({ path: "./env" });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// route imported
import userRouter from "./routes/user.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
// route declared
app.use("/api/v1/users", userRouter);
app.use("/api/v1/tweets", tweetRouter);

export default app;
