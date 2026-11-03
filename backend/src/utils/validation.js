const { body, validationResult, matchedData } = require("express-validator")

const validateUser = [
	body("email").isEmail().withMessage("Provide an accurate email!"),
	body("password").notEmpty().withMessage("Provide a password").isLength({ min: 8 }).withMessage("Password is too short!"),
	body("username").optional().isLength({ max: 10 }).withMessage("Username is too long!")
]


module.exports = {
	validateUser
}
