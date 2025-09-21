import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());

// DO NOT use express.json() or express.urlencoded() here!

import userRouter from "./routes/user.routes.js";
app.use("/api/v1/users", userRouter);

export default app;