const express = require("express");
const app = express();
const axios = require("axios");
const dotenv = require("dotenv");
const { registerFont, createCanvas, loadImage } = require('canvas');

dotenv.config();
app.use(express.json());
registerFont('consola.ttf', { family: 'Consola' });

let token = '';

axios.post('https://api.intra.42.fr/oauth/token', {
		"grant_type": "client_credentials",
		"client_id": process.env.CLIENT_ID,
		"client_secret": process.env.CLIENT_SECRET
	}).then(resp => {
		token = resp;
	}).catch(err => {
		console.log(err);
	});

app.get('/:id', async (req, res) => {
	try {
		const response = await axios.get(`https://api.intra.42.fr/v2/users/${req.params.id}`, {
			headers: { Authorization: `Bearer ${token.data.access_token}`}});
		const canvas = createCanvas(400, 250);
		const ctx = canvas.getContext('2d');
	
		const bg = await loadImage('badge13.png');
		const logo42 = await loadImage('42logowhite.png');
		const logo1337 = await loadImage('1337logo.png');
		const intra_image = await loadImage(response.data.image_url);
		ctx.drawImage(bg, 0, 0, 400, 250);
		ctx.drawImage(logo42, 300, 20, 67, 11);
		ctx.drawImage(logo1337, 150, 190, 80, 80);
		ctx.drawImage(intra_image, 40, 40, 100, 100);
		ctx.beginPath();
		ctx.font = '16px consola';
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText(response.data.login, 170, 53);
		ctx.fillText(response.data.usual_full_name, 170, 75);
		ctx.fillText(response.data.email, 170, 96);
		ctx.fillStyle = 'rgb(42, 184, 127)';
		ctx.fillRect(168, 110, 70, 30);
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText(response.data.cursus_users[1].grade, 171, 130);
		ctx.fillStyle = 'rgb(37, 74, 59)';
		ctx.fillRect(61, 170.2, 280, 40);
		ctx.beginPath();
		ctx.arc(60, 190, 20, 0 , 2 * Math.PI);
		ctx.arc(340, 190, 20, 0 , 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = 'rgb(27, 191, 125)';
		ctx.beginPath();
		ctx.arc(60, 190, 20, 0 , 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText(`Level ${Math.round(response.data.cursus_users[1].level)} - ${Math.round((response.data.cursus_users[1].level % 1) * 100)}%`, 140, 195);
		res.send('<img src="' + canvas.toDataURL() + '" />');
		//res.json(response.data.usual_full_name);
	} catch (err) {
		console.log(err);
		res.status(404).json({error: "user not found."});
	}


});

app.listen(80, () => {
    console.log("server is up running...");
});