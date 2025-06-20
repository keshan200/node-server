import mongoose from "mongoose"

type Customer = {
  name: string
  email: string
  phone: string
  address: string
}

const customerSchema = new mongoose.Schema<Customer>({
  name: {
    type: String,
    minlength: [2, "Name must be at least 2 characters long"],
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    unique: [true, "User already registered"],
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: String,
    minlength: [10, "Phone number must be at least 10 characters long"],
    required: [true, "Phone number is required"],
    trim: true,
  },
  address: {
    type: String,
    minlength: [5, "Address must be at least 10 characters long"],
    required: [true, "Address is required"],
    trim: true,
  },
})

export const CustomerModel = mongoose.model("Customer", customerSchema)
