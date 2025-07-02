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
       
        
      },

      email:{
         type:String,
        required:true,
       
       
      },

      phone:{
         type:String,
        required:true,
       
         
      },


      address:{
         type:String,
        required:true,
       
      }

})


export const cusmodel =  mongoose.model("Customer",CustomerSchema);