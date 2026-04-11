export const sendToken = (user, statusCode, message, res)=>{
    const token = user.generateToken() // generate token using the method defined in the User model

    // send token in cookie and also send user data and token in response
    res.status(statusCode).cookie("token", token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
    }).json({
        success: true,
        user,
        message,
        token
    })
}