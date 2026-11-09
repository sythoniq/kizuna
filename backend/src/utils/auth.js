require("dotenv").config()
const jwt = require("jsonwebtoken")
const prisma = require("./prisma.js")

async function authorizeUser(req, res ,next) {
	try {
		if (!req["headers"].authorization) {
			return res.status(401).json({ success: false, message: "Token not provided" });
		}

		const token = req["headers"].authorization.split(" ")[1]

		const result = jwt.verify(token, process.env.JWT_SECRET)
		const user = await prisma.user.findUnique({
			where:{
				user_id: result.user_id
			},
			omit: {
				user_hash: true
			}
		})

		if (!user) {
			return res.status(401).json({ success: false, message: "Unauthorized user!"})
		}

		req.user = user
		next();
	} catch(err) {
		return res.status(500).json({ success: false, message: "Server Error", err})
	}
}

module.exports = {
	authorizeUser
}
