import { NextFunction ,Request,Response} from "express";
import{cusmodel} from "../models/customerModel"
import { APIError } from "../errors/APIerror";




export const saveCustomer = async ( req:Request,res:Response,next:NextFunction)=>{


    try{

       const customer= new cusmodel(req.body)
       await customer.save()
       res.status(200).json(customer)

    }catch(error:any){
        next(error)
    }


}



export const getCustomer = async ( req:Request,res:Response,next:NextFunction)=>{

     try{

       const customer = await cusmodel.find()
       res.status(200).json(customer)

    }catch(error:any){
        next(error)
    }

}


export const deleteCustomer = async ( req:Request,res:Response,next:NextFunction)=>{

     try{

       const deleteCus = await cusmodel.findByIdAndDelete(req.params.id);
       
       if(!deleteCus){
        throw new APIError(404,"Customer not Found")
       }

       res.status(200).json(deleteCus)

    }catch(error:any){
        next(error)
    }

}


export const updateCustomer = async ( req:Request,res:Response,next:NextFunction)=>{

     try{

       const updateCus = await cusmodel.findByIdAndUpdate(
         
        req.params.id,
        req.body,
        {
            new:true, 
            // id true >> return update customer
            //id false >> return old customer

            runValidators:true
            //run validators before updating
        }

       );
       
    
       res.status(200).json(updateCus)

    }catch(error:any){
        next(error)
    }

}