import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import EmployeeModel from "./db/model/EmployeeModel.js"

const PORT = 8081

const app = express()
app.use(cors())
app.use(express.json())

let database = []

const log = (req) => {
  console.log(`${req.method} ${req.path}`)
}

const findEmployee = (id) => {
  let employeeFind = null
  let employeeIndex = null

  database.forEach((employee, index) => {
    if (employee.id === Number(id)) {
      employeeFind = { ...employee }
      employeeIndex = index
    }
  })

  return [employeeFind, employeeIndex]
}

app.get("/api/v1/employees/", async (req, res) => {
  log(req)

  res.send(database)
})

app.get("/api/v1/employees/:id", async (req, res) => {
  log(req)
  const { id } = req.params

  const employee = findEmployee(id)

  employee[0]
    ? res.send(employee[0])
    : res.status(404).send({ error: "Employee not found" })
})

app.post("/api/v1/employees/", async (req, res) => {
  log(req)
  const { firstName, lastName, emailId } = req.body

  const newEmployee = {
    id: database.length > 0 ? database[database.length - 1]["id"] + 1 : 1,
    firstName,
    lastName,
    emailId,
  }

  database.push(newEmployee)

  res.send(newEmployee)
})

app.put("/api/v1/employees/:id", async (req, res) => {
  log(req)
  const { id } = req.params
  const { lastName, firstName, emailId } = req.body

  const employee = findEmployee(id)

  if (!employee[0]) {
    res.status(404).send({ error: "Employee not found" })

    return
  }

  const updatedEmployee = {
    id: employee[0].id,
    firstName: firstName ?? employee[0].firstName,
    lastName: lastName ?? employee[0].lastName,
    emailId: emailId ?? employee[0].emailId,
  }

  database[employee[1]] = updatedEmployee

  employee[0]
    ? res.send(updatedEmployee)
    : res.status(404).send({ error: "Employee not found" })
})

app.delete("/api/v1/employees/:id", async (req, res) => {
  log(req)
  const { id } = req.params

  const employee = findEmployee(id)

  if (!employee[0]) {
    res.status(404).send({ error: "Employee not found" })

    return
  }

  database = [
    ...database.filter((employee) => {
      return employee.id !== Number(id)
    }),
  ]

  res.send(employee[0])
})

app.listen(PORT, () => {
  console.log("Running on port", PORT)
})
