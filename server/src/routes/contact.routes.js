import { Router } from "express";
import {
  createContact,
  listContactMessages,
} from "../controllers/contact.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { adminRequired } from "../middleware/adminRequired.js";

const router = Router();

router.get("/", authRequired, adminRequired, listContactMessages); // admin
router.post("/", createContact); // public

export default router;
