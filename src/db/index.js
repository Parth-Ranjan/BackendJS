import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


 const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`) 
    console.log("✅ Database connected successfully");
   
    }
  catch(error){
    console.log("Error connecting to the database:", error);  
    process.exit(1);  
  }
}
export default connectDB;