const { Router } = require("express")
const root = Router()
const controller = require("../controllers/rootController.js")
const validator = require("../utils/validator.js")

root.post("/register", 
	validator.validateUser, 
	validator.handleValidationError,
	controller.registerUser
)

root.post("/login", 
	validator.validateUser, 
	validator.handleValidationError,
	controller.loginUser
)

module.exports = root;
