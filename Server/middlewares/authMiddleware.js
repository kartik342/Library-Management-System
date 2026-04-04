import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddleware.js";
import jwt from "jsonwebtoken"
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  let token

  if (req.cookies && req.cookies.token && req.cookies.token !== "null" && req.cookies.token !== "") {
    token = req.cookies.token
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }

  if (!token) {
    return next(new ErrorHandler("Please login to access", 401))
  }

  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decodedData.id)
    if (!req.user) {
      return next(new ErrorHandler("Please login to access", 401))
    }
    next()
  } catch (error) {
    return next(new ErrorHandler("Please login to access", 401))
  }
})

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`User with this role is not (${req.user.role}) authorized to access this resource`, 400))
    }
    next()
  }
}