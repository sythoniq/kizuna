const { validationResult, matchedData } = require("express-validator")
const bcrypt = require("bcryptjs")
const prisma = require("../prisma/db.ts").db

async function registerUser(req, res, next) {
	try {
		const result = validationResult(req)	

		if(!result.isEmpty()) {
			console.log(result.array())
			return res.status(422).json({success: false, message: "Validation Error", errors: result.array()})
		}

		const { email, password, username } = matchedData(req)
		const passwordHash = await bcrypt.hash(password, 10)
		const user = await prisma.orm.public.User.create({
				user_email: email,
				user_hash: passwordHash,
				user_name: username
		})	
		// TODO: Make sure to have a check for whether the email is taken and do this effiiently...
		if (!user) {
		}

		return res.status(200).json({success: true, message: "User created!"});
	} catch(err) {
		console.log(err)
		return res.status(500).json({success: false, message: "Server error"})
	}
}

async function loginUser(req, res, next) {
	try {

	} catch(err) {
		return res.status(500).json({success: false, message: "Server error"})
	}
}

module.exports = {
	registerUser,
	loginUser
}
