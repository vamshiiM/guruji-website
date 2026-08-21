// Integration tests for the security-critical API paths.
// Runs against whatever DATABASE_URL is configured (uses the seeded admin).
// Creates only prefixed test users/bookings and cleans them up afterward.
//
// Run with: npm test   (requires the DB up and seeded)

import { test, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { createApp } from "../src/app.js";
import { prisma } from "../src/db.js";
import { env } from "../src/config/env.js";

const app = createApp();
const PREFIX = `test_${Date.now()}_`;
const email = (n) => `${PREFIX}${n}@example.com`;
const ADMIN = env.adminEmail;
const ADMIN_PW = process.env.ADMIN_PASSWORD || "guruji108";

after(async () => {
  await prisma.booking.deleteMany({ where: { email: { startsWith: PREFIX } } });
  await prisma.user.deleteMany({ where: { email: { startsWith: PREFIX } } });
  await prisma.$disconnect();
});

test("signup issues a cookie and /me returns the session", async () => {
  const agent = request.agent(app);
  const s = await agent
    .post("/api/auth/signup")
    .send({ name: "T", email: email("a"), password: "secret1" });
  assert.equal(s.status, 201);
  assert.equal(s.body.user.role, "user");

  const me = await agent.get("/api/auth/me");
  assert.equal(me.body.user.email, email("a"));
});

test("wrong admin password returns BAD_ADMIN", async () => {
  const r = await request(app)
    .post("/api/auth/login")
    .send({ email: ADMIN, password: "definitely-wrong" });
  assert.equal(r.status, 401);
  assert.equal(r.body.error.code, "BAD_ADMIN");
});

test("registering a reserved admin email returns RESERVED_EMAIL", async () => {
  const r = await request(app)
    .post("/api/auth/signup")
    .send({ name: "X", email: "admin@divya.com", password: "secret1" });
  assert.equal(r.body.error.code, "RESERVED_EMAIL");
});

test("bookings are scoped to the user, and the admin gate blocks non-admins", async () => {
  const user = request.agent(app);
  await user.post("/api/auth/signup").send({ name: "U", email: email("b"), password: "secret1" });

  const created = await user
    .post("/api/bookings")
    .send({ service: "Rudra Abhishek", date: "2026-10-01", phone: "+91 90000 00000", name: "U" });
  assert.equal(created.status, 201);
  const bid = created.body.booking.id;

  const mine = await user.get("/api/bookings");
  assert.equal(mine.body.bookings.length, 1);
  assert.equal(mine.body.bookings[0].email, email("b"));

  // Non-admin cannot change status.
  const forbidden = await user.patch(`/api/bookings/${bid}`).send({ status: "Confirmed" });
  assert.equal(forbidden.status, 403);

  // Admin can.
  const admin = request.agent(app);
  await admin.post("/api/auth/login").send({ email: ADMIN, password: ADMIN_PW });
  const ok = await admin.patch(`/api/bookings/${bid}`).send({ status: "Confirmed" });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.booking.status, "Confirmed");
});

test("unauthenticated access to bookings is rejected", async () => {
  const r = await request(app).get("/api/bookings");
  assert.equal(r.status, 401);
});
