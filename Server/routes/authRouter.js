import express from "express"
import { register, verifyOTP } from "../controllers/authControllers.js"

const router = express.Router()

// console.log("Auth router loaded");
router.post("/register", register) // https:localhost:4000/api/v1/auth/register
   
router.get("/test", (req, res) => {
    res.json({ message: "test working" });
});

router.post("/verify-otp", verifyOTP);
export default router