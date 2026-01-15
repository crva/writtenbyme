import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config";
import passport from "./config/passport";
import { sessionMiddleware } from "./config/session";
import { logger } from "./lib/logger";
import analyticsRoutes from "./routes/analytics";
import articlesRoutes from "./routes/articles";
import authRoutes from "./routes/auth";
import paymentsRoutes from "./routes/payments";
import userRoutes from "./routes/user";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  })
);

// Session middleware
app.use(sessionMiddleware);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/articles", analyticsRoutes);
app.use("/api/articles", articlesRoutes);
app.use("/api/payments", paymentsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.port, () => {
  logger.info(
    `Server running on port ${config.port} in ${config.nodeEnv} mode`
  );
});
