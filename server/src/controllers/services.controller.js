import { prisma } from "../db.js";
import { AppError, asyncHandler } from "../lib/errors.js";
import { cappedString } from "../lib/validate.js";
import { serializeService } from "../lib/serializers.js";

// Public: the booking form and services page read this.
export const listServices = asyncHandler(async (_req, res) => {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "asc" } });
  res.json({ services: services.map(serializeService) });
});

export const addService = asyncHandler(async (req, res) => {
  const { name, price, duration, description, icon } = req.body || {};
  const safeName = cappedString(name, { field: "Service name", max: 120, required: true });
  const safeDuration = cappedString(duration, { field: "Duration", max: 40 });
  const safeDescription = cappedString(description, { field: "Description", max: 500 });
  const safeIcon = cappedString(icon, { field: "Icon", max: 40 });

  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum < 0) {
    throw new AppError("VALIDATION", "Enter a valid price.", 400);
  }

  const service = await prisma.service.create({
    data: {
      name: safeName,
      price: Math.round(priceNum),
      duration: safeDuration || "1 hr",
      // Optional; default to "" so the public catalog never renders undefined.
      description: safeDescription,
      icon: safeIcon,
    },
  });
  res.status(201).json({ service: serializeService(service) });
});

export const removeService = asyncHandler(async (req, res) => {
  const existing = await prisma.service.findUnique({ where: { id: req.params.id } });
  if (!existing) throw new AppError("NOT_FOUND", "Service not found.", 404);

  await prisma.service.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});
