import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Mirrors DEFAULT_SERVICES from the old src/lib/auth.jsx so the site looks identical.
const DEFAULT_SERVICES = [
  { name: "Vedic Wedding", price: 51000, duration: "4–6 hrs" },
  { name: "Satyanarayan Katha", price: 11000, duration: "2 hrs" },
  { name: "Griha Pravesh", price: 21000, duration: "3 hrs" },
  { name: "Navagraha Puja", price: 15000, duration: "2 hrs" },
  { name: "Rudra Abhishek", price: 9000, duration: "1.5 hrs" },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};
const daysAhead = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

// Mirrors SAMPLE_BOOKINGS so the admin dashboard isn't empty on first run.
const SAMPLE_BOOKINGS = [
  { name: "Rohan Sharma",   email: "rohan.sharma@gmail.com",   phone: "+91 98200 11221", service: "Vedic Wedding",      date: daysAhead(12), status: "Confirmed",           createdAt: daysAgo(2),  notes: "Outdoor mandap, 200 guests." },
  { name: "Priya Iyer",     email: "priya.iyer@outlook.com",   phone: "+91 99870 33445", service: "Satyanarayan Katha", date: daysAhead(4),  status: "Confirmed",           createdAt: daysAgo(3),  notes: "Sunday morning." },
  { name: "Aditya Verma",   email: "aditya.v@yahoo.com",       phone: "+91 98112 77881", service: "Griha Pravesh",      date: daysAhead(7),  status: "Pending confirmation", createdAt: daysAgo(1),  notes: "New flat in Andheri." },
  { name: "Meera Nair",     email: "meera.nair@gmail.com",     phone: "+91 90043 55667", service: "Navagraha Puja",     date: daysAhead(2),  status: "Confirmed",           createdAt: daysAgo(6),  notes: "" },
  { name: "Karan Mehta",    email: "karan.mehta@hotmail.com",  phone: "+91 98765 41200", service: "Rudra Abhishek",     date: daysAhead(1),  status: "Pending confirmation", createdAt: daysAgo(1),  notes: "Monday morning slot." },
  { name: "Ananya Gupta",   email: "ananya.g@gmail.com",       phone: "+91 99201 88990", service: "Satyanarayan Katha", date: daysAhead(10), status: "Confirmed",           createdAt: daysAgo(8),  notes: "" },
  { name: "Rohan Sharma",   email: "rohan.sharma@gmail.com",   phone: "+91 98200 11221", service: "Navagraha Puja",     date: daysAhead(20), status: "Pending confirmation", createdAt: daysAgo(0),  notes: "Pre-wedding shanti." },
  { name: "Vikram Singh",   email: "vikram.singh@gmail.com",   phone: "+91 97011 22334", service: "Griha Pravesh",      date: daysAgo(3),    status: "Cancelled",           createdAt: daysAgo(9),  notes: "Postponed by family." },
  { name: "Sneha Kulkarni", email: "sneha.kulkarni@gmail.com", phone: "+91 98220 60401", service: "Rudra Abhishek",     date: daysAhead(5),  status: "Confirmed",           createdAt: daysAgo(4),  notes: "" },
  { name: "Arjun Pillai",   email: "arjun.pillai@gmail.com",   phone: "+91 96000 47755", service: "Vedic Wedding",      date: daysAhead(45), status: "Pending confirmation", createdAt: daysAgo(5),  notes: "Destination wedding — Goa." },
];

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "guruji@divya.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "guruji108";

  // 1. Bootstrap admin — idempotent upsert so re-seeding is safe.
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN" },
    create: {
      name: "Guruji",
      email: adminEmail,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });
  console.log(`✓ Admin ensured: ${adminEmail}`);

  // 2. Services — only seed if empty (don't clobber admin edits).
  if ((await prisma.service.count()) === 0) {
    await prisma.service.createMany({ data: DEFAULT_SERVICES });
    console.log(`✓ Seeded ${DEFAULT_SERVICES.length} services`);
  } else {
    console.log("• Services already present — skipped");
  }

  // 3. Sample bookings — only seed if empty.
  if ((await prisma.booking.count()) === 0) {
    await prisma.booking.createMany({
      data: SAMPLE_BOOKINGS.map((b) => ({
        name: b.name,
        email: b.email,
        phone: b.phone,
        service: b.service,
        date: b.date,
        status: b.status,
        notes: b.notes || null,
        createdAt: new Date(b.createdAt),
      })),
    });
    console.log(`✓ Seeded ${SAMPLE_BOOKINGS.length} sample bookings`);
  } else {
    console.log("• Bookings already present — skipped");
  }

  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
