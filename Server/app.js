import express, { urlencoded } from "express"
import { config } from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
import { connectDB } from "./database/db.js"
import { errorMiddleware } from "./middlewares/errorMiddleware.js"
import authRouter from "./routes/authRouter.js"
import bookRouter from "./routes/bookRouter.js"
import borrowRouter from "./routes/borrowRouter.js"
import userRouter from "./routes/userRouter.js"
import expressFileUpload from "express-fileupload" 
import { notifyUser } from "./services/notifyUser.js"
import { removeUnverifiedAccounts } from "./services/removeUnverifiedAccounts.js"


export const app = express()

config({path: "./config/config.env"})



app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.urlencoded({extended: true}))
app.use(expressFileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}))

// console.log("Auth router:", authRouter);
app.use("/api/v1/auth", authRouter) // https://localhost:4000/api/v1/auth AND later =>  https://localhost:4000/api/v1/auth
app.use("/api/v1/book", bookRouter) // https://localhost:4000/api/v1/book
app.use("/api/v1/borrow", borrowRouter) // https://localhost:4000/api/v1/borrow
app.use("/api/v1/user", userRouter) // https://localhost:4000/api/v1/user

notifyUser()
removeUnverifiedAccounts()


// app.get("/test", (req, res) => {
//     res.json({ message: "app test working" });
// });
 
connectDB()

app.use(errorMiddleware)