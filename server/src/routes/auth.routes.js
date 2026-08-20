import { Router } from "express";
import { signup, login, logout, me } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/authRequired.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", authRequired, logout);
router.get("/me", me);

export default router;
