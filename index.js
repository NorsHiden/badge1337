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
	"client_secret": process.env.CLIENT_SECRET}).then(resp => {token = resp.data});
	
app.get('/badge/:id', async (req, res) => {
	try{
		var response = await axios.get(`https://api.intra.42.fr/v2/users/${req.params.id}`, {
			headers: { Authorization: `Bearer ${token.access_token}`}});
	} catch(err){
		return res.status(404).json({});
	}
	const canvas = createCanvas(400, 250);
	const ctx = canvas.getContext('2d');
	if (req.query.mode == 'dark')
	{
		var color = 'rgb(255, 255, 255)';
		var bg = await loadImage('blackbg.png');
		var logo42 = await loadImage('42logowhite.png');
		var logo1337 = await loadImage('1337logo.png');
	}
	else
	{
		var color = 'rgb(0, 0, 0)';
		var bg = await loadImage('whitebg.png');
		var logo42 = await loadImage('42logo.png');
		var logo1337 = await loadImage('1337logoblack.png');
	}
	const grade_staff = await loadImage('gradestaff.png');
	const grade_student = await loadImage('gradestudent.png');
	const intra_image = await loadImage(response.data.image_url);
	ctx.drawImage(bg, 0, 0, 400, 250);
	ctx.drawImage(logo42, 300, 20, 67, 11);
	if (!response.data.cursus_users[1].grade)
	{
		ctx.drawImage(logo1337, 120, 120, 150, 150);
		ctx.drawImage(grade_staff, 166, 110, 55, 30);
	}
	else
	{
		ctx.drawImage(logo1337, 150, 190, 80, 80);
		ctx.drawImage(grade_student, 166, 110, 73, 30);
	}
	ctx.drawImage(intra_image, 40, 40, 100, 100);
	ctx.beginPath();
	ctx.font = '16px consola';
	ctx.fillStyle = color;
	ctx.fillText(response.data.login, 170, 53);
	ctx.fillText(response.data.usual_full_name, 170, 75);
	ctx.fillText(response.data.email, 170, 96);
	if (response.data.cursus_users[1].grade == 'Learner')
	{
		ctx.fillStyle = color;
		ctx.fillText(response.data.cursus_users[1].grade, 171, 130);
	}
	else if (response.data.cursus_users[1].grade == 'Member')
	{
		ctx.fillStyle = 'rgb(42, 184, 127)';
		ctx.fillRect(168, 110, 70, 30);
		ctx.fillStyle = color;
		ctx.fillText(response.data.cursus_users[1].grade, 171, 130);
	}
	else
	{
		ctx.fillStyle = color;
		ctx.fillText("Staff", 171, 130);
	}
	ctx.fillStyle = 'rgb(37, 74, 59)';
	if (response.data.cursus_users[1].grade)
	{
		ctx.fillRect(61, 170.2, 280, 40);
		ctx.beginPath();
		ctx.arc(60, 190, 20, 0 , 2 * Math.PI);
		ctx.arc(340, 190, 20, 0 , 2 * Math.PI);
		ctx.fill();
		ctx.fillStyle = 'rgb(27, 191, 125)';
		ctx.beginPath();
		ctx.arc(60, 190, 20, 0 , 2 * Math.PI);
		ctx.arc((((((response.data.cursus_users[1].level % 1) * 100) * 280)) / 100) + 60, 190, 20, 0 , 2 * Math.PI);
		ctx.fillRect(61, 170.2, (((((response.data.cursus_users[1].level % 1) * 100) * 280)) / 100), 40);
		ctx.fill();
		ctx.fillStyle = 'rgb(255, 255, 255)';
		ctx.fillText(`Level ${Math.trunc(response.data.cursus_users[1].level)} - ${Math.trunc((response.data.cursus_users[1].level % 1) * 100)}%`, 140, 195);
	}
	res.send('<img src="' + canvas.toDataURL() + '" />');
});

app.listen(80, () => {
    console.log("server is up running...");
});