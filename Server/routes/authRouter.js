import express from "express"
import {logout, login, register, verifyOTP } from "../controllers/authControllers.js"
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router()

   
// router.get("/test", (req, res) => {
//     res.json({ message: "test working" });
// });

router.post("/register", register) // https:localhost:4000/api/v1/auth/register

router.post("/verify-otp", verifyOTP);

router.post("/login", login);

router.get("/logout", isAuthenticated, logout);
export default router



