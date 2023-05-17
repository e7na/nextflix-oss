import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getRefreshToken } from "../controllers/usersController.js";
import { validateToken } from "./jwt.js";
import { authenticatedRequest } from "./types.js";

// protect ur routes using this middleware
export const validateAccessToken = (
  req: authenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  // this should act like the refreshToken invalid res
  if (!accessToken) res.status(401).json({ msg: "no cookies yasta" });
  else {
    try {
      const userData = validateToken(accessToken);
      req.userData = userData;
      req.callbackUrl = req.originalUrl || "/";
      next();
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) {
        // redirects the req to the refresh endpoint
        res.redirect("/api/auth/refresh");
      } else if (err instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ message: "Invalid access token" });
      }
    }
  }
};

export const validateRefreshToken = async (
  req: authenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) res.status(401).json({ msg: "no cookies yasta" });
  else {
    const { refreshToken: existingRefreshToken } = await getRefreshToken(
      refreshToken
    );
    if (!existingRefreshToken)
      res.status(401).send({ msg: "wrong refresh token" });
    else {
      try {
        const userData = validateToken(existingRefreshToken) as JwtPayload;
        delete userData.iat;
        delete userData.exp;
        req.user = userData;
        next();
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return res.status(401).json({ message: "Refresh token has expired" });
        } else if (err instanceof jwt.JsonWebTokenError) {
          return res.status(401).json({ message: "Invalid Refresh token" });
        }
      }
    }
  }
};
