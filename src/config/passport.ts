import passport from "passport";
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from "passport-google-oauth20";
import { createUser, getUserByEmail, getUserByID } from "../auth/auth.model";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      const email = profile.emails?.[0]?.value ?? "";
      const providerId = profile.id;
      const avatar = profile.photos?.[0]?.value as string;
      let user = await getUserByEmail(email);


      if (!user) {
        user = await createUser({
          email,
          provider: "google",
          providerId,
          avatar
        });
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: Number, done) => {
  const user = await getUserByID(id);
  done(null, user);
});

export default passport;
