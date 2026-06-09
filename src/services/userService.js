import jwt from "jsonwebtoken";
import { registerUser, loginUser, getUserById } from "../data/userData";
import {
  USER_ALREADY_EXISTS,
  USER_REGISTER_FAILED_ERROR,
  LOGIN_FAILED_ERROR,
} from "../constants";

export async function register(name, email, password) {
  try {
    return await registerUser(name, email, password);
  } catch (error) {
    if (error.message === USER_ALREADY_EXISTS) {
      throw new Error(USER_REGISTER_FAILED_ERROR);
    }
    throw error;
  }
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
