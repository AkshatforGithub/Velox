import express from "express";
import { logout, signup , login, UpdateProfile, checkAuth} from "../controllers/auth.controller.js";
import{protectRoute} from "../middleware/auth.middleware.js"

const router = express.Router();

router.post("/signup", signup)

router.post("/login", login);

router.post("/logout", logout);

router.post("/UpdateProfile",protectRoute, UpdateProfile);

router.get("/check",protectRoute , checkAuth)


export default router;  