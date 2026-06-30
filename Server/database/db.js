import mongoose from "mongoose";

export const connectDB = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName : "Library_management_DB"
    }).then(()=>{
        console.log("Database connected successfully...")
    }).catch((err)=>{
        console.log("Error connecting to DB", err)
    })
}