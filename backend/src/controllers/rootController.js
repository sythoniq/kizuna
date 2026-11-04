require("dotenv").config()
const prisma = require("../utils/prisma.js")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

async function getUserByEmail(email) {
	const user = await prisma.user.findUnique({
		where: {
			user_email: email
		},
		omit: {
			user_hash: true
		}
	})

	if (!user) {
		return {
			success: false,
			message: "User not found!"
		}
	}

	return { success: true, user }
}

async function registerUser(req, res, next) {
	try {
		const { email, password, username } = req.body

		const passwordHash = await bcrypt.hash(password, 10)

		const user = await prisma.user.create({
			data: {
				user_email: email,
				user_hash: passwordHash,
				user_name: username || null
			}
		})

		return res.status(200).json({ success: true, message: "User created!"});
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error"})
	}
}

async function loginUser(req, res, next) {
	try {
		const result = await getUserByEmail(req.body.email)
		if (!result.success) {
			return res.status(404).json({ success: false, message: result.message })
		}
		
		const token = jwt.sign({ user_id: result.user.user_id, iat: Date.now()}, process.env.JWT_SECRET, { expiresIn: '7d' });

		return res.status(200).json({ success: true, message: "Successful login!", token});
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error"})
	}
}

module.exports = {
	registerUser,
	loginUser
}
