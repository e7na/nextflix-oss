import { Router } from "express";
import auth_router from "./auth/index.js";
import media_router from "./media/index.js";
import user_router from "./user/index.js";
// this router is supposed to handle all the api routes (movies,tv,apis,uses,etc)
const router: Router = Router();

router.use("/auth", auth_router);
router.use("/media", media_router);
router.use("/user", user_router);

export default router;
