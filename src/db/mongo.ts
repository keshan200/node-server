import mongoose from "mongoose"


export const connectDB =async () =>{

   try{
      await mongoose.connect(process.env.DB_URL as string)
        console.log("connect DB")

   }catch(err){
        console.error(err)
        process.exit(1)
   }


}