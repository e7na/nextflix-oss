import passport from "passport";
import { VerifyCallback } from "passport-oauth2";
import { Strategy } from "passport-discord";
import { createUser, findUserByEmail } from "../controllers/usersController.js";
import { User } from "@e7na/api-spec";

const strategyOptions = {
  clientID: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  callbackURL: process.env.DISCORD_REDIRECT_URL,
  scope: ["identify", "email"],
};

passport.use(
  new Strategy(
    strategyOptions,
    async (
      accessToken: string,
      refreshToken: string,
      profile: Strategy.Profile,
      done: VerifyCallback
    ) => {
      try {
        // console.log(profile);
        const user: any = {
          FirstName: profile["username"],
          Email: profile["email"]!,
        };
        const existingUser: User = (await findUserByEmail(
          user["Email"]!
        )) as User;
        // console.log(existingUser);
        if (existingUser)
          done(null, {
            userid: existingUser["UserID"],
            name: existingUser["FirstName"],
            countryid: existingUser.CountryID,
          });
        else {
          console.log("the user doesn't exist");
          const newUser = await createUser(user);
          if (newUser)
            done(null, {
              userid: newUser["UserID"],
              name: newUser["FirstName"],
              countryid: newUser.CountryID,
            });
          else {
            console.log("failed to create a new user for the discord guy");
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
