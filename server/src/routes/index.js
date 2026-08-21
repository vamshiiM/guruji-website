import { Router } from "express";
import auth from "./auth.routes.js";
import bookings from "./bookings.routes.js";
import services from "./services.routes.js";
import contact from "./contact.routes.js";
import users from "./users.routes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ ok: true }));
router.use("/auth", auth);
router.use("/bookings", bookings);
router.use("/services", services);
router.use("/contact", contact);
router.use("/users", users);

export default router;
