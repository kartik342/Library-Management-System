import ErrorHandler from "../middlewares/errorMiddleware.js"
import { User } from "../models/userModel.js"
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js"
import bcrypt from "bcrypt"
import crypto from "crypto"
import { sendVerificationCode } from "../utils/sendVerificationCode.js"
import { sendToken } from "../utils/sendToken.js"
import { sendEmail } from "../utils/sendEmail.js"
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplate.js"

export const register = catchAsyncErrors(async(req, res, next)=>{
    try{
        const {name, email, password} = req.body

        if(!name || !email || !password){ // if any filed is empty
            return next(new ErrorHandler("Please enter all fields", 400))
        }

        // if user already exist 
        const isRegistered = await User.findOne({email, accountVerified: true})
        if(isRegistered){
            return next(new ErrorHandler("User already exists", 400)) // Without return, your code might continue executing.
        }

        // if user not exist but there are multiple registration attempts with same email but not verified, allow user to register but limit the number of registration attempts to 5
        const registrationAttemptsByUser = await User.find({email, accountVerified: false})
        if(registrationAttemptsByUser.length >= 5){
            return next(new ErrorHandler("You have exceeded number of registration attempts. Please contact support", 400))
        }

        // now registering the user
        if(password.length < 8 || password.length > 16){
            return next(new ErrorHandler("Password must be between 8 to 16 characters",400))
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        })
        const verificationCode = user.generateVerificationCode()
        await user.save()
        sendVerificationCode(verificationCode, email, res)

    }
    catch(error){
        next(error) 
    }
})

export const verifyOTP = catchAsyncErrors(async(req, res, next)=>{
    try {
        const {email, otp} = req.body

        if(!email || !otp){
            return next(new ErrorHandler("Email and OTP is missing", 400))
        }

        // there are multiple entries for unverified users with same email means multiple otp, get the latest otp
        const userAllEntries = await User.find({email, accountVerified: false}).sort({createdAt: -1})

        if(!userAllEntries || userAllEntries.length === 0){
            return next(new ErrorHandler("User not found", 400))
        }

        let user;

        if(userAllEntries.length > 1){
            // delete all previous entries except the latest one
            user = userAllEntries[0]
            await User.deleteMany({_id: {$ne: user._id}, email, accountVerified: false}) //  $ne = “not equal” => Delete all matching documents where _id is NOT equal to current user’s ID.
        }
        else{
            user = userAllEntries[0] // user only have one unverified entry
        }

        // now we have the user with latest otp, we can verify the otp
        if(user.verificationCode !== Number(otp)){
            return next(new ErrorHandler("Invalid OTP", 400))
        }
        
        // if otp is expired 
        if(!user.verificationCodeExpire || user.verificationCodeExpire < Date.now()){
            return next(new ErrorHandler("OTP has expired", 400))
        }

        // if otp is valid and not expired, verify the user
        user.accountVerified = true
        user.verificationCode = undefined   // remove otp and otp expire time from database after successful verification
        user.verificationCodeExpire = undefined
        await user.save({validateModifiedOnly: true}) // validateModifiedOnly means only validate the fields that are modified, in this case we are only modifying accountVerified, verificationCode and verificationCodeExpire fields, so only these fields will be validated, it will improve performance

        sendToken(user, 200, "User verified successfully", res) // after successful verification, we can send token to user and log them in

    } 
    catch (error) {
        next(new ErrorHandler(error.message, 500))
    }
})

export const login = catchAsyncErrors(async(req, res, next)=>{

    const {email, password} = req.body
    if(!email || !password){
        return next(new ErrorHandler("Please enter all fields", 400))
    }

    const user = await User.findOne({email, accountVerified: true}).select("+password") // only verified user can login
    if(!user){
        return next(new ErrorHandler("Invalid email or password", 400))
    }
    
    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password", 400))
    }

    sendToken(user, 200, "Login successful", res)
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200)
    .cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    })
})

export const getUser = catchAsyncErrors(async(req, res, next)=>{
    const user = req.user
    res.status(200).json({
        success: true,
        user,
    })
})

export const forgotPassword = catchAsyncErrors(async(req, res, next)=>{
    if(!req.body.email){
        return next(new ErrorHandler("Email is required", 400))
    }
    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true
    })
    if(!user){
        return next(new ErrorHandler("Invalid email", 400))
    }   

    const resetToken = user.getResetPasswordToken()
    await user.save({validateBeforeSave: false}) // validateBeforeSave means do not validate the fields before saving, we are only modifying resetPasswordToken and resetPasswordExpire fields, so we can skip validation for other fields

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`
    // Here you would typically send an email with the resetPasswordUrl to the user. For this example, we'll just return the URL in the response.

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl)

    try {
        await sendEmail({
            email: user.email,
            subject: "BookWorm Library Management System - Password Reset",
            message,
        })
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false})
        return next(new ErrorHandler(error.message, 500))
    }
})