import jwt from "jsonwebtoken";
import { JWT_SECERT_TOKEN } from "./env";

const createToken = async (userId) => {
  const token = await jwt.sign({ userId: userId }, JWT_SECERT_TOKEN, {
    expiresIn: "7d",
  });
  return token;
};

const verifyToken = async (cookie) => {
  const token = await jwt.verify(cookie, JWT_SECERT_TOKEN);
  return token;
};

export { createToken, verifyToken };
