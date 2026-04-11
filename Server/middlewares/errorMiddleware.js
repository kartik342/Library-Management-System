class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message) // super means this is the property of Error class
        this.statusCode = statusCode
    }
}

export const errorMiddleware=(err, req, res, next)=>{
    err.message = err.message || "Internal Server Error"
    err.statusCode = err.statusCode || 500

    if(err.code === 11000){ //It is a MongoDB error code for duplicate value
        const message = "Duplicate field value entered"
        const statusCode = 400
        err = new ErrorHandler(message, statusCode)
    }

    if(err.name === "JsonWebTokenError"){ 
        const message = "Json web token is invalid. Try again."
        const statusCode = 400
        err = new ErrorHandler(message, statusCode)
    }

    if(err.name === "TokenExpiredError"){ 
        const message = "Json web token is expired. Try again."
        const statusCode = 400
        err = new ErrorHandler(message, statusCode)
    }

    if(err.name === "CastError"){ // CastError is a Mongoose/MongoDB error that happens when you provide an invalid format of data
        const message = `Resource not found. Invalid: ${err.path}`
        const statusCode = 400
        err = new ErrorHandler(message, statusCode)
    }

    const errorMessage = err.errors 
    ? Object.values(err.errors)
    .map(error=> error.message)
    .join(" ") 
    : err.message

    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    })

}


export default ErrorHandler;