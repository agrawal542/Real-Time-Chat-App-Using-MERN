import { Router } from "express";
import { authUser, registerUser,allUser } from "../controllers/user.controllers.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/').post(registerUser).get(protect, allUser)
router.post('/login',authUser)

export default router;
