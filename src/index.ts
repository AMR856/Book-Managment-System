import dotenv from 'dotenv';
dotenv.config();

import { RedisStore } from "connect-redis";
import { createClient } from "redis";
import { errorHandler } from "./utils/errorHandler";

import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "./config/passport";
import authorRouter from "./author/author.route";
import publisherRouter from "./publishers/publisher.route";
import authRouter from "./auth/auth.route";

const app = express();
const port = process.env.PORT || 5000;
const defaultRedisURL = "redis://localhost:6379";
const prefix = "books-api-sessions:";

const redisClient = createClient({
  url: process.env.REDIS_URL || defaultRedisURL,
});
redisClient.connect().catch(console.error);

const redisStore = new RedisStore({
  client: redisClient,
  prefix,
});

app.use(bodyParser.json());
app.set("view engine", "ejs");
app.set("views", "./src/views");

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
app.use("/auth", authRouter);

app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
