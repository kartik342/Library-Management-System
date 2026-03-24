import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true
        },
        password:{
            type: String,
            required: true,
            select: false, // when we query user, password will not be included in result by default, we have to explicitly ask for it
        },
        role: {
            type: String,
            enum: ["Admin", "User"],
            default: "User"
        },
        accountVerified:{
            type: Boolean,
            default: false
        },
        borrowedBooks: [
            {
                bookId: 
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Borrow"
                },
                returned: {
                    type: Boolean,
                    default: false
                },
                bookTitle: {
                    type: String,
                },
                borrowedDate: {
                    type: Date,
                },
                dueDate: {
                    type: Date,
                },
            }
        ],
        avatar: {
            public_id: String,
            url: String
        },
        verificationCode: {
            type: Number,
        },
        verificationCodeExpire: {
            type: Date,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        }
    },
    {
        timestamps: true
    }
)

userSchema.methods.generateVerificationCode = function(){
    function generateRandomFiveDigitNumber() {
        return crypto.randomInt(10000, 100000);
    }
    
    const verificationCode =  generateRandomFiveDigitNumber()
    this.verificationCode = verificationCode
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000 // 15(min) * 60(sec) * 1000(milisecond) => 15 min
    return verificationCode
}

userSchema.methods.generateToken = function(){
    // generate token using jsonwebtoken package, we will use user id as payload and secret key from env file
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
        
    })
}
export const User = mongoose.model("User", userSchema)