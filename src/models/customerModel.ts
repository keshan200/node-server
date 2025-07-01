import mongoose from "mongoose"

type Customers = {

   name:string
   email:string
   phone:string
   address:string

}


const CustomerSchema = new mongoose.Schema<Customers>({


      name:{
        type:String,
        required:true,
        trim:true,
        minlength:[2,"name must be at lea"],
      },

      email:{
         type:String,
        required:true,
        trim:true,
        minlength:[2,"name must be at lea"],
      },

      phone:{
         type:String,
        required:true,
        trim:true,
         minlength:[2,"name must be at lea"],
      },


      address:{
         type:String,
        required:true,
        trim:true,
        minlength:[2,"name must be at lea"],
      }

})


export const cusmodel =  mongoose.model<Customers>("Customer",CustomerSchema);