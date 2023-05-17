/*
https://www.passportjs.org/packages/passport-local/
*/

import passport from "passport";
import {
  createUser,
  findUserByEmail,
  findUserByName,
} from "../controllers/usersController.js";
// import { Strategy } from "passport-local";
import { User } from "@e7na/api-spec";
// import { User } from "../utils/types.js";
import { Strategy as LocalStrategy } from "passport-local";
import { hashPassword, validatePassword } from "../utils/passwordHashi.js";

// if the password or username is null this won't work
passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email: string, password: string, done) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) {
          console.log("mfe4 ya ba4a");
          done(null, false);
        } else if (!(await validatePassword(password, user["PasswordHash"]!))) {
          console.log("wrong pass yasta");
          done(null, false);
        } else {
          done(null, {
            userid: user["UserID"],
            name: user["FirstName"],
            countryid: user.CountryID,
          });
          // console.log("GG!");
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.use(
  "local-signup",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email: string, password: string, done) => {
      const userInfo: User = {
        // still didnt hash the password ik
        PasswordHash: req.body["password"] as string,
        FirstName: req.body["fname"] as string,
        LastName: req.body["lname"] as string,
        Gender: req.body["gender"] as "Male" | "Female",
        Email: req.body["email"] as string,
        Address: req.body["address"] as string,
        CountryID: req.body["countryid"] as string,
        PhoneNumber: req.body["phone"] as string,
      };
      // const userInfo = User.parse({
      //   // still didnt hash the password ik
      //   PasswordHash: req.body["password"] as string,
      //   FirstName: req.body["fname"] as string,
      //   LastName: req.body["lname"] as string,
      //   Gender: req.body["gender"] as "Male" | "Female",
      //   Email: req.body["email"] as string,
      //   Address: req.body["address"] as string,
      //   CountryID: req.body["countryid"] as number,
      //   PhoneNumber: req.body["phone"] as string,
      // });
      userInfo;
      const user = await findUserByEmail(userInfo["Email"]!);
      if (user) {
        console.log("already exists");
        done(null, false);
      } else {
        // console.log("ok we should insert that");
        // let's hash the password here
        userInfo.PasswordHash = await hashPassword(userInfo.PasswordHash!);
        const newUser: User = (await createUser(userInfo)) as User;
        if (newUser) {
          done(null, {
            userid: newUser["UserID"],
            name: userInfo["FirstName"],
            countryid: userInfo.CountryID,
          });
        } else {
          console.log("failed to create a new user for the caveman guy");
          done(null, false);
        }
      }
    }
  )
);

/*
  1- for the sign in the req body should be a json like: 
    {
      "email": ,
      "password": ,
    }

  2- for the sign up: 
    {
      "email": ,
      "password": ,
      "address: ,
      "gender": ,
      "countryid": ,
      "fname": ,
      "lname": ,
      "phone":
    }

*/
