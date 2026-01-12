import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { auth } from "./authJsLibConfig.js";
import { config } from "./config.js";
import articlesRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/auth", auth);
app.use("/api/articles", articlesRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.port, () => {});
