const { body, params, validationResult } = require("express-validator")

const validateUser = [
	body("email").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Please provide a proper email").escape(),
	body("password").trim().notEmpty().withMessage("Password cannot be empty").isLength({ min: 8 }).withMessage("Password needs to be 8 characters long."),
	body("username").optional().trim().escape(),
]

const validateUserUpdate = [
	body("email").trim().notEmpty().withMessage("Email cannot be empty").isEmail().withMessage("Please provide a valid email").escape(),
	body("username").trim().optional().escape()
]

const validateUserPasswordUpdate = [
	body("password").trim().notEmpty().withMessage("Password cannot be empty!").isLength({ min: 8 }).withMessage("Password needs to be 8 characters long.").escape()
]

const validatePost = [
	body("postContent").trim().notEmpty().withMessage("Cannot post empty post").isLength({ max: 999 }).withMessage("Post is too long.").escape()
]

function handleValidationError(req, res, next) {
	const result = validationResult(req);	
	if (!result.isEmpty()) {
		const error = result.array()
		return res.status(400).json({success: false, message: "Validation Error", error})
	}

	next();
}

module.exports = {
	handleValidationError,
	validateUser,
	validateUserUpdate,
	validateUserPasswordUpdate,
	validatePost
}
