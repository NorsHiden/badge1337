const express = require("express")
const app = express()
const { getToken, getUser } = require("./getToken")
const genBadge = require("./genBadge")

app.use(express.json())


var token = ''


app.get('/badge/:id', async (req, res) => {
	let user = await getUser(req, token)
	for (let i = 0; i < 2 && !user.data; i++){
		token = await getToken()
		if (!token.data)
			return res.status(500).json({error: "server is down"})
		user = await getUser(req, token.data)
	}
	if (!user.data)
		return res.status(404).json({error: "user not found"})
	await genBadge(req, res, user)
})

app.listen(80, () => {
    console.log("server is up running...")
})