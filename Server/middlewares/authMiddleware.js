import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let { token } = req.cookies
  if (!token || token === "null" || token === "") {
    return next(new ErrorHandler("Please login to access", 401))
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    next()
  } catch (error) {
    return next(new ErrorHandler("Please login to access", 401))
  }
})