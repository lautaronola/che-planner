import jwt from "jsonwebtoken";
import { registerUser, loginUser, getUserById } from "../data/userData.js";
import { LOGIN_FAILED_ERROR } from "../constants/index.js";

export async function register(name, email, password) {
  return await registerUser(name, email, password);
}

export async function login(email, password) {
  const user = await loginUser(email, password);
  if (!user) {
    throw new Error(LOGIN_FAILED_ERROR);
  }
  const { password: _password, ...userWithoutPassword } = user;

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  return { user: userWithoutPassword, token };
}

export async function getUser(id) {
  return await getUserById(id);
}
