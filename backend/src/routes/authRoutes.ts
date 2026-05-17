import { Router } from "express";
import { register, login } from "../controllers/authController";
import { registerValidator, loginValidator } from "../validators/authValidator";
import { validate } from "../middleware/validate";

const router = Router();

router.post("/register", registerValidator, validate, register);
router.post("/login", loginValidator, validate, login);

export default router;
