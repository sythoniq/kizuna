const cors = require("cors")

const express = require("express")
const server = express()

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: false }))

const root = require("./routes/root.js")
const posts = require("./routes/posts.js")
server.use("/", root)
server.use("/posts", posts)

server.listen(3000, (err) => {
	if (err) {
		console.error("Unexpected error: ", err)
	}
	console.log("Server is live on 3000")
})
