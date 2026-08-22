import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const EXPIRES_IN = "7d";
const ALG = "HS256";

export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: EXPIRES_IN, algorithm: ALG });

// Pin the algorithm on verify so a token can never dictate its own (defense
// against alg-confusion/`alg:none`-style attacks).
export const verifyToken = (token) =>
  jwt.verify(token, env.jwtSecret, { algorithms: [ALG] });
