import { Router } from "express";
import passport from "passport";
import {
  validateAccessToken,
  validateRefreshToken,
} from "../../utils/middlewares.js";
import { createAccessToken, createRefreshToken } from "../../utils/jwt.js";
import { updateRefreshToken } from "../../controllers/usersController.js";

// this router is for handling the authentication redirections
const router: Router = Router();

router.get(
  "/discord",
  passport.authenticate("discord", {
    failureRedirect: "/api/auth/fail",
    session: false,
  })
);

const profileCompletionURL = `http://localhost:${process.env.FRONTEND_PORT}/auth/signup/complete`;

router.get(
  "/discord/redirect",
  passport.authenticate("discord", {
    failureRedirect: "/api/auth/fail",
    session: false,
  }),
  async (req, res) => {
    res.cookie("accessToken", createAccessToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", await createRefreshToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.redirect(profileCompletionURL);
    // res.send({ status: "success" }).status(200);
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/fail",
    session: false,
  })
);

router.get(
  "/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/api/auth/fail",
    session: false,
  }),
  async (req, res) => {
    res.cookie("accessToken", createAccessToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", await createRefreshToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.redirect(profileCompletionURL);
    // res.send({ status: "success" }).status(200);
  }
);

router.post(
  "/login",
  passport.authenticate("local-signin", {
    failureRedirect: "/api/auth/fail",
    session: false,
  }),
  async (req, res) => {
    res.cookie("accessToken", createAccessToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", await createRefreshToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    console.log("we have put the cookies");
    res.sendStatus(200);
  }
);

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    failureRedirect: "/api/auth/fail",
    session: false,
  }),
  async (req, res) => {
    // console.log(req.user);
    res.cookie("accessToken", createAccessToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.cookie("refreshToken", await createRefreshToken(req.user), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    });
    res.sendStatus(200);
  }
);

router.use("/fail", (req, res) => {
  res.sendStatus(401);
});

// here we should have req.useData like all the roues above & we gotta generate a new accessToken
router.get("/refresh", validateRefreshToken, (req: any, res) => {
  res.cookie("accessToken", createAccessToken(req.user), {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    sameSite: "strict",
    secure: true,
  });
  console.log("refreshed a token rn :)");
  res.redirect(req.callbackURL);
});

router.delete("/logout", validateAccessToken, async (req, res) => {
  // https://stackoverflow.com/questions/21978658/invalidating-json-web-tokens
  const UserID = (req as any).userData.userid;
  await updateRefreshToken(UserID, null);
  res.clearCookie("accessToken").clearCookie("refreshToken").sendStatus(200);
});

export default router;
