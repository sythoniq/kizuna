const { Router } = require("express")
const root = Router()
const controller = require("../controllers/rootController.js")
const validator = require("../utils/validator.js")
const auth = require("../utils/auth.js")

root.get("/user/:userId", 
	auth.authorizeUser,
	controller.getUserDetails	
)

/* TODO
root.post("/user/:userId/update",
	auth.authorizeUser,
	validator.validateUserUpdate,
	controller.updateUserDetails
)
*/

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

root.post("/connection/:userId/request", 
	auth.authorizeUser, 
	controller.requestConnection
)

root.post("/connection/:connId/accept",
	auth.authorizeUser,
	controller.acceptConnection
)

root.delete("/connection/:connId/delete", 
	auth.authorizeUser, 
	controller.deleteConnection
)

module.exports = root;
