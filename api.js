import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import EmployeeModel from "./db/model/EmployeeModel.js"

const PORT = 8081

const app = express()
app.use(cors())
app.use(express.json())

const log = (req) => {
  console.log(`${req.method} ${req.path}`)
}

const formatEmployee = (employee) => {
  return {
    id: employee.id,
    firstName: employee.firstName,
    lastName: employee.lastName,
    emailId: employee.emailId,
  }
}

app.get("/api/v1/employees/", async (req, res) => {
  log(req)
  await mongoose.connect("mongodb://localhost:27017/cloud")

  const employees = await EmployeeModel.find({})

  let formatedEmployees = []
  employees.forEach((employee) => {
    formatedEmployees.push(formatEmployee(employee))
  })

  await mongoose.disconnect()

  res.send(formatedEmployees)
})

app.get("/api/v1/employees/:id", async (req, res) => {
  log(req)
  const { id } = req.params

  await mongoose.connect("mongodb://localhost:27017/cloud")

  try {
    const employee = await EmployeeModel.findOne({ id })
    await mongoose.disconnect()

    employee
      ? res.send(formatEmployee(employee))
      : res.status(404).send({ error: "Employee not found" })
  } catch (err) {
    await mongoose.disconnect()
    res.status(404).send({ error: "Employee not found" })

    return
  }
})

app.post("/api/v1/employees/", async (req, res) => {
  log(req)
  const { firstName, lastName, emailId } = req.body

  await mongoose.connect("mongodb://localhost:27017/cloud")

  const lastEmployee = await EmployeeModel.find({}).sort({ id: -1 }).limit(1)

  const newEmployee = await EmployeeModel.create({
    id: lastEmployee.length > 0 ? lastEmployee[0].id + 1 : 1,
    firstName,
    lastName,
    emailId,
  })

  await mongoose.disconnect()

  res.send(formatEmployee(newEmployee))
})

app.put("/api/v1/employees/:id", async (req, res) => {
  log(req)
  const { id } = req.params
  const { lastName, firstName, emailId } = req.body

  await mongoose.connect("mongodb://localhost:27017/cloud")

  try {
    const employee = await EmployeeModel.findOne({ id })

    const updatedEmployee = {
      id: employee.id,
      lastName: lastName ?? employee.lastName,
      firstName: firstName ?? employee.firstName,
      emailId: emailId ?? employee.emailId,
    }

    await EmployeeModel.updateOne({ id }, updatedEmployee)

    await mongoose.disconnect()

    employee
      ? res.send(formatEmployee(updatedEmployee))
      : res.status(404).send({ error: "Employee not found" })
  } catch (err) {
    await mongoose.disconnect()

    res.status(404).send({ error: "Employee not found" })

    return
  }
})

app.delete("/api/v1/employees/:id", async (req, res) => {
  log(req)
  const { id } = req.params

  await mongoose.connect("mongodb://localhost:27017/cloud")

  try {
    const employee = await EmployeeModel.findOne({ id })

    await EmployeeModel.deleteOne({ id })
    await mongoose.disconnect()

    employee
      ? res.send(formatEmployee(employee))
      : res.status(404).send({ error: "Employee not found" })
  } catch (err) {
    await mongoose.disconnect()
    res.status(404).send({ error: "Employee not found" })

    return
  }
})

app.listen(PORT, () => {
  console.log("Running on port", PORT)
})
