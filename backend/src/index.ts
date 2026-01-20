import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config/index.js";
import passport from "./config/passport.js";
import { sessionMiddleware } from "./config/session.js";
import { logger } from "./lib/logger.js";
import analyticsRoutes from "./routes/analytics.js";
import articlesRoutes from "./routes/articles.js";
import authRoutes from "./routes/auth.js";
import paymentsRoutes from "./routes/payments.js";
import userRoutes from "./routes/user.js";

const app = express();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

// Session middleware
app.use(sessionMiddleware);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

// Add 1 second delay for testing purposes
// app.use((req, res, next) => {
//   setTimeout(() => next(), 1000);
// });

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/articles", analyticsRoutes);
app.use("/articles", articlesRoutes);
app.use("/payments", paymentsRoutes);

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(config.port, () => {
  logger.info(
    `Server running on port ${config.port} in ${config.nodeEnv} mode`,
  );
});
