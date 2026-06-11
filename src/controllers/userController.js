import { register, login } from "../services/userService.js";
import { register, login, getUser } from "../services/userService.js";

export async function getUserController(req, res) {
  const { id } = req.params;
  try {
    const user = await getUser(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function registerUserController(req, res) {
  const { name, email, password } = req.body;
  try {
    const user = await register(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function loginUserController(req, res) {
  const { email, password } = req.body;
  try {
    const user = await login(email, password);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
