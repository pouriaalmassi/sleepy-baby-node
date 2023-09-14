// Models
require("./db/mongoose")
const mongoose = require("mongoose")

// Routers
const userRouter = require("./routers/user")

// Express
const express = require("express")
const app = express()

app.use(express.json())
app.use(userRouter)

module.exports = app
