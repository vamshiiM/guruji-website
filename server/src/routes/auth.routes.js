import { Router } from "express";
import { signup, login, logout, me, changePassword } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { authLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authRequired, logout);
router.post("/change-password", authLimiter, authRequired, changePassword);
router.get("/me", me);

export default router;
