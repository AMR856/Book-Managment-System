import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { setupSwagger } from "./config/swagger";
import passport from "./config/passport";
import { errorHandler } from "./utils/errorHandler";
import authorRouter from "./modules/authors/author.route";
import publisherRouter from "./modules/publishers/publisher.route";
import authRouter from "./modules/auth/auth.route";
import bookRouter from "./modules/books/book.route";
import orderRouter from "./modules/orders/order.route";


export const createApp = async () => {
  const app = express();
  const defaultRedisURL = "redis://localhost:6379";
  const prefix = "books-api-sessions:";

  const redisClient = createClient({
    url: process.env.REDIS_URL || defaultRedisURL,
  });

  await redisClient.connect().catch(console.error);

  const redisStore = new RedisStore({
    client: redisClient,
    prefix,
  });

  app.use(cors());
  app.use(bodyParser.json());

  app.use(
    session({
      store: redisStore,
      secret: process.env.SESSION_SECRET!,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  setupSwagger(app);

  app.get("/", (req, res) => res.render("google-auth-test", { user: req.user }));
  app.get("/debug-session", (req, res) => {
    res.json({
      cookie: req.headers.cookie,
      session: req.session,
      user: req.user,
    });
  });

  app.use("/authors", authorRouter);
  app.use("/publishers", publisherRouter);
  app.use("/api/auth", authRouter);
  app.use("/books", bookRouter);
  app.use("/orders", orderRouter);

  app.use(errorHandler);

  return app;
};
