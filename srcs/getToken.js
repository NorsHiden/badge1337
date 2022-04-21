const axios = require("axios")

module.exports = {
	"getToken": async () => {
		try {
			return await axios.post('https://api.intra.42.fr/oauth/token', {
				"grant_type": "client_credentials",
				"client_id": process.env.CLIENT_ID,
				"client_secret": process.env.CLIENT_SECRET
			})
		}
		catch (err) {
			return (err)
		}
	},
	"getUser": async (req, token) => {
		try {
		 return await axios.get(`https://api.intra.42.fr/v2/users/${req.params.id}`, {
			headers: { Authorization: `Bearer ${token.access_token}`}})
		}
		catch (err) {
			return (err)
		}
	}
}