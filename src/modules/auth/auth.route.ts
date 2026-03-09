import express from "express";
import passport from "passport";
import { validate } from "../../middlewares/validate";
import { registerSchema, loginSchema } from "./auth.validations";
import { authenticate } from "./auth.middleware";
import {
  googleAuthteticateCallback,
  logOutSesssion,
  register,
  login,
  logoutJwt,
  getProfile,
} from "./auth.controller";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google"),
  googleAuthteticateCallback,
);

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logoutJwt);
router.get("/profile", authenticate, getProfile);

router.get("/logout", logOutSesssion);

export default router;
