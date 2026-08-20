import { Router } from "express";
import {
  listBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookings.controller.js";
import { authRequired } from "../middleware/authRequired.js";
import { adminRequired } from "../middleware/adminRequired.js";

const router = Router();

router.get("/", authRequired, listBookings);
router.post("/", authRequired, createBooking);
router.patch("/:id", authRequired, adminRequired, updateBooking);
router.delete("/:id", authRequired, adminRequired, deleteBooking);

export default router;
