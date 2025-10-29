import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";
dotenv.config({
    path: "./.env"
});
connectDB().then(()=>{
    app.listen(process.env.PORT||8000),()=>{
        console.log(`Server is running on port${process.env.PORT||8000}`)}})
       .catch((error) => {
    console.error("Database connection failed:", error);
});


/*async function  connectDB(){
  try{
     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
     console.log("✅ Database connected successfully");
  }
   catch(error){
    console.error("Error connecting to the database:", error);
   }
}*/