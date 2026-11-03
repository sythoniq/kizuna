const { Router } = require("express")
const root = Router()

const controller = require("../controllers/rootCont.js")
const validator = require("../utils/validation.js")

// Authentication routes for the end user...
root.post("/register", validator.validateUser, controller.registerUser)
root.post("/login", validator.validateUser, controller.loginUser)

module.exports = root;
