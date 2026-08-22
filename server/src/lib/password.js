import bcrypt from "bcryptjs";

const ROUNDS = 12;

export const hashPassword = (plain) => bcrypt.hash(plain, ROUNDS);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

// A valid bcrypt hash to compare against when a login email doesn't exist, so
// both the "user found" and "user not found" paths spend the same bcrypt time
// and can't be distinguished by response timing (user enumeration defense).
export const DUMMY_HASH = bcrypt.hashSync("timing-equalizer-not-a-real-password", ROUNDS);
