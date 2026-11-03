const cors = require("cors")
const express = require("express")
const app = express()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: true}))

const root = require("./routes/root.js")

app.use("/", root)

app.listen(3000, (error) => {
	if (error) {
		console.error(error)
	}

	console.log("Server running on 3000")
})

