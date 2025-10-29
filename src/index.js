import dotenv from "dotenv";
import connectDB from "./db/index.js";
dotenv.config({
    path: "./.env"
});
connectDB();

/*async function  connectDB(){
  try{
     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
     console.log("✅ Database connected successfully");
  }
   catch(error){
    console.error("Error connecting to the database:", error);
   }
}*/