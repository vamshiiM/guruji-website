// Single source of truth mapping a service's `icon` string (stored in the DB)
// to a lucide-react component. A React component can't live in the DB, so the
// server stores a key (e.g. "Heart") and the client resolves it here.
//
// Keep these keys in sync with the admin add-service <select> (Admin.jsx) and
// the seed's DEFAULT_SERVICES icons (server/prisma/seed.js).
import { Home, Flame, Heart, Star, Sparkles, Sun, Moon, Gem, Baby } from "lucide-react";

export const SERVICE_ICONS = { Home, Flame, Heart, Star, Sparkles, Sun, Moon, Gem, Baby };

// Allowed keys, for building the admin <select> options.
export const SERVICE_ICON_NAMES = Object.keys(SERVICE_ICONS);

// Resolve a stored key to a component, falling back to Flame for empty/unknown
// values so a service always renders an icon.
export const iconFor = (name) => SERVICE_ICONS[name] ?? Flame;
