import { Router } from "express";
import { register, login, Account } from "../controllers/UserController.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/account", Account);

export default router;