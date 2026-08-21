import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const EXPIRES_IN = "7d";

export const signToken = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: EXPIRES_IN });

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret);
