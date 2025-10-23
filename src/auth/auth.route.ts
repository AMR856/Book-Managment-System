import express from "express";
import passport from "passport";
const router = express.Router();
import { googleAuthteticateCallback, logOutSesssion } from "./auth.controller";

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  googleAuthteticateCallback
);

router.get("/logout", logOutSesssion);

export default router;
