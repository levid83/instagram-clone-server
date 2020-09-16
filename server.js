import cors from "cors";
import express from "express";
import mongoose from "mongoose";

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [process.env.ALLOWED_CORS_ORIGIN],
    methods: "GET,PUT,POST,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  })
);

app.use(express.json());

if (process.env.NODE_ENV == "production") {
  app.use(express.static("build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
  });
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("connected", () => {
  app.listen(PORT, () => {
    console.log("server is running on", PORT);
  });
});
mongoose.connection.on("error", (err) => {
  console.log("err connecting", err);
});