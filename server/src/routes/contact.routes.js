import { Router } from "express";
import {
  createContact,
  listContactMessages,
} from "../controllers/contact.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { adminRequired } from "../middleware/adminRequired.js";
import { contactLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.get("/", authRequired, adminRequired, listContactMessages); // admin
router.post("/", contactLimiter, createContact); // public

export default router;
