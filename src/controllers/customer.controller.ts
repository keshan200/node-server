import { Request, Response } from "express"
import { CustomerModel } from "../models/Customer"

export const createCustomer = async (req: Request, res: Response) => {
    const customer = new CustomerModel(req.body)
    await customer.save()
    res.status(201).json(customer)
}