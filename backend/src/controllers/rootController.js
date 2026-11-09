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

		const result = await getUserByEmail(email);
		if (result.success) { 
			return res.status(400).json({ success: false, message: "Email is taken!" })
		}

		const user = await prisma.user.create({
			data: {
				user_email: email,
				user_hash: passwordHash,
				user_name: username || null
			}
		})

		return res.status(200).json({ success: true, message: "User created!"});
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
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
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function getUserDetails(req, res, next) {
	try {
		return res.status(200).json({ success: true, user: req.user })	
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function updateUserDetails(req, res, next) {
	//TODO: this has too many edge cases to handle in one fell swoop...
}

async function requestConnection(req, res, next) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				user_id: Number(req.params.userId)
			}
		})

		if(!user) {
			return res.status(404).json({ success: false, message: "User not found!" })
		}

		const connection = await prisma.connections.create({
			data: {
				target_id: Number(req.params.userId),
				user_id: Number(req.user.user_id),
				status: "Pending"
			}
		});

		return res.status(200).json({ success: true, message: "Request sent!", connection })
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function acceptConnection(req, res, next) {
	try {
		const connection = await prisma.connections.findUnique({
			where: {
				connection_id: Number(req.params.connId)
			}
		})
		
		if(!connection) {
			return res.status(404).json({ success: false, message: "Connection not found!" })
		}

		await prisma.connections.update({
			where: { connection_id: Number(req.params.connId) },
			data: { status: "Accepted", connected_at: new Date() }
		})

		return res.status(200).json({ success: true, message: "Connection accepted" })
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

async function deleteConnection(req, res, next) {
	try {
		const connection = await prisma.connections.findUnique({
			where: { connection_id: Number(req.params.connId) }
		})
		if (!connection) {
			return res.status(404).json({ success: false, message: "Connection not found!" })
		}

		await prisma.connections.delete({
			where: { connection_id: Number(req.params.connId) }
		})

		return res.status(200).json({ success: true, message: "Connection deleted" })
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server error", err })
	}
}

module.exports = {
	registerUser,
	loginUser,
	getUserDetails,
	updateUserDetails,
	requestConnection,
	acceptConnection,
	deleteConnection
}
