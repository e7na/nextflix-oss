import passport from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { createUser, findUserByEmail } from "../controllers/usersController.js";
// import { User } from "../utils/types.js";
import { User } from "@e7na/api-spec";

const strategyOptions: any = {
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: process.env.GOOGLE_REDIRECT_URL!,
  passReqToCallback: false,
  scope: ["email", "profile"],
};

// google profile type isn't provided with the module idk why
passport.use(
  new Strategy(
    strategyOptions,
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: VerifyCallback
    ) => {
      try {
        const user: any = {
          FirstName: profile.given_name,
          Email: profile.email,
        };
        const existingUser = await findUserByEmail(user["Email"]!);
        if (existingUser)
          done(null, {
            userid: existingUser["UserID"],
            name: existingUser["FirstName"],
            countryid: existingUser.CountryID,
          });
        else {
          const newUser = await createUser(user);
          if (newUser)
            done(null, {
              userid: newUser["UserID"],
              name: newUser["FirstName"],
              countryid: newUser.CountryID,
            });
          else {
            console.log("failed to create a new user for the google guy");
            done(null, false);
          }
        }
      } catch (err) {
        console.log(err);
        done(err as any, false);
      }
    }
  )
);
