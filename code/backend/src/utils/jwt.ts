import jwt from "jsonwebtoken";
import { updateRefreshToken } from "../controllers/usersController.js";

export const createAccessToken = (data: any) =>
  jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: 1000 * 60 * 15, // 15 minutes
  });

export const createRefreshToken = async (data: any) => {
  const refreshToken = jwt.sign(data, process.env.JWT_SECRET!, {
    expiresIn: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
  // store this reffresh token in the database
  const flag = await updateRefreshToken(data["userid"], refreshToken);
  return refreshToken;
};
// for validating access/refresh token
export const validateToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET!);
