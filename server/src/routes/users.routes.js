import { Router } from "express";
import { listUsers } from "../controllers/users.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { adminRequired } from "../middleware/adminRequired.js";

const router = Router();

router.get("/", authRequired, adminRequired, listUsers); // admin

export default router;
