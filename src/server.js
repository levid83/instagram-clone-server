import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import authRouter from "./routes/auth";
import postRouter from "./routes/post";
import userRouter from "./routes/user";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.APP_URI],
    methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(express.json());

app.use([authRouter, postRouter, userRouter]);

if (process.env.NODE_ENV == "production") {
  app.use(express.static("build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

// error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
  app.listen(PORT, () => {
    console.log("server is running on", PORT);
  });
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});
