// Models
require("./db/mongoose")
const mongoose = require("mongoose")

// Routers
const userRouter = require("./routers/user")
const sleepRouter = require("./routers/sleep")

// Express
const express = require("express")
const app = express()

app.use(express.json())
app.use(userRouter)
app.use(sleepRouter)

module.exports = app
