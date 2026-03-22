import express, { urlencoded } from "express"
import { config } from "dotenv"
import cookieParser from "cookie-parser"
// import cors from "cors"
import { connectDB } from "./database/db.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
import authRouter from "./routes/authRouter.js"

export const app = express()

config({path: "./config/config.env"})

// app.use(cors({
//     origin: [process.env.FRONTEND_URL],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true
// }))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// console.log("Auth router:", authRouter);
app.use("/api/v1/auth", authRouter) // https://localhost:4000/api/v1/auth AND later =>  https:localhost:4000/api/v1/auth

app.get("/test", (req, res) => {
    res.json({ message: "app test working" });
});
 
connectDB()

app.use(errorMiddleware)