import { Router } from "express";
import {
  listServices,
  addService,
  removeService,
} from "../controllers/services.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { adminRequired } from "../middleware/adminRequired.js";

const router = Router();

router.get("/", listServices); // public
router.post("/", authRequired, adminRequired, addService);
router.delete("/:id", authRequired, adminRequired, removeService);

export default router;
