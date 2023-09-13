// Models
require("./db/mongoose")
const mongoose = require("mongoose")

// Routers

// Express
const express = require("express")
const app = express()

app.use(express.json())
// app.use(nameOfRouter)

module.exports = app
