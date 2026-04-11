import express from "express";
import { addBook, deleteBook, getAllBooks } from "../controllers/bookController.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router()

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook)

router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook)

router.get("/all", getAllBooks)

export default router