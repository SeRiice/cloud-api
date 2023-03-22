import mongoose from "mongoose"
import EmployeeSchema from "../schema/EmployeeSchema.js"

const EmployeeModel = mongoose.model("Employee", EmployeeSchema)

export default EmployeeModel
