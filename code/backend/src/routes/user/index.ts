import { Router } from "express";
import { validateAccessToken } from "../../utils/middlewares.js";
import { dbErrorHandler } from "../../utils/db.js";
import { User, z, PartialBy } from "@e7na/api-spec";
import {
  getUserById,
  updateUserByID,
} from "../../controllers/usersController.js";
import { createAccessToken, createRefreshToken } from "../../utils/jwt.js";
import jwt from "jsonwebtoken";

const router = Router();

router.use(validateAccessToken);

router.get("/", async (req, res) => {
  const UserID = (req as any).userData.userid;

  type UserDetails =
    | PartialBy<User, "PasswordHash" | "RefreshToken">
    | undefined;
  const user: UserDetails = await getUserById(UserID);

  if (!user) {
    res.status(500).send("Internal Server Error");
    return;
  }
  delete user.PasswordHash;
  delete user.RefreshToken;

  return res.status(200).send(user);
});

router.put("/", async (req, res) => {
  const partialUser = User.partial()
    .required({ UserID: true })
    .safeParse(req.body);

  if (!partialUser.success) {
    res.status(400).send("Bad Request");
    return;
  }

  const result = await updateUserByID(partialUser.data);
  if (!result) {
    res.status(400).send("Bad Request; User not found");
    return;
  }

  const user = await getUserById(partialUser.data.UserID);
  if (!user) {
    res.status(500).send("Internal Server Error");
    return;
  }

  const newUser = {
    userid: user.UserID,
    name: user.FirstName,
    countryid: user.CountryID,
  };

  res // serializing the user can be factored out
    .cookie("accessToken", createAccessToken(newUser), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    })
    .cookie("refreshToken", await createRefreshToken(newUser), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      sameSite: "strict",
      secure: true,
    })
    .status(200)
    .send("User updated successfully");
});

router.use(dbErrorHandler);
export default router;
