import mongoose from "mongoose";

export const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017/",{
        dbName : "Library_management_DB"
    }).then(()=>{
        console.log("Database connected successfully...")
    }).catch((err)=>{
        console.log("Error connecting to DB", err)
    })
}