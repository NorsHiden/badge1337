const { registerFont, createCanvas, loadImage } = require('canvas')


module.exports = async (req, res, user) => {
	registerFont('fonts/consola.ttf', { family: 'Consola' })
	const canvas = createCanvas(400, 250)
	const ctx = canvas.getContext('2d')
	if (req.query.mode == 'dark')
	{
		var color = 'rgb(255, 255, 255)'
		var bg = await loadImage('images/blackbg.png')
		var logo42 = await loadImage('images/42logowhite.png')
		var logo1337 = await loadImage('images/1337logo.png')
	}
	else
	{
		var color = 'rgb(0, 0, 0)'
		var bg = await loadImage('images/whitebg.png')
		var logo42 = await loadImage('images/42logo.png')
		var logo1337 = await loadImage('images/1337logoblack.png')
	}
	const grade_staff = await loadImage('images/gradestaff.png')
	const grade_student = await loadImage('images/gradestudent.png')
	const intra_image = await loadImage(user.data.image_url)
	ctx.drawImage(bg, 0, 0, 400, 250)
	ctx.drawImage(logo42, 300, 20, 67, 11)
	if (!user.data.cursus_users[1].grade)
	{
		ctx.drawImage(logo1337, 120, 120, 150, 150)
		ctx.drawImage(grade_staff, 166, 110, 55, 30)
	}
	else
	{
		ctx.drawImage(logo1337, 150, 190, 80, 80)
		ctx.drawImage(grade_student, 166, 110, 73, 30)
	}
	ctx.drawImage(intra_image, 40, 40, 100, 100)
	ctx.beginPath()
	ctx.font = '16px consola'
	ctx.fillStyle = color
	ctx.fillText(user.data.login, 170, 53)
	ctx.fillText(user.data.usual_full_name, 170, 75)
	ctx.fillText(user.data.email, 170, 96)
	if (user.data.cursus_users[1].grade == 'Learner')
	{
		ctx.fillStyle = color
		ctx.fillText(user.data.cursus_users[1].grade, 171, 130)
	}
	else if (user.data.cursus_users[1].grade == 'Member')
	{
		ctx.fillStyle = 'rgb(42, 184, 127)'
		ctx.fillRect(168, 110, 70, 30)
		ctx.fillStyle = color
		ctx.fillText(user.data.cursus_users[1].grade, 171, 130)
	}
	else
	{
		ctx.fillStyle = color
		ctx.fillText("Staff", 171, 130)
	}
	ctx.fillStyle = 'rgb(37, 74, 59)'
	if (user.data.cursus_users[1].grade)
	{
		ctx.fillRect(61, 170.2, 280, 40)
		ctx.beginPath()
		ctx.arc(60, 190, 20, 0 , 2 * Math.PI)
		ctx.arc(340, 190, 20, 0 , 2 * Math.PI)
		ctx.fill()
		ctx.fillStyle = 'rgb(27, 191, 125)'
		ctx.beginPath()
		ctx.arc(60, 190, 20, 0 , 2 * Math.PI)
		ctx.arc((((((user.data.cursus_users[1].level % 1) * 100) * 280)) / 100) + 60, 190, 20, 0 , 2 * Math.PI)
		ctx.fillRect(61, 170.2, (((((user.data.cursus_users[1].level % 1) * 100) * 280)) / 100), 40)
		ctx.fill()
		ctx.fillStyle = 'rgb(255, 255, 255)'
		ctx.fillText(`Level ${Math.trunc(user.data.cursus_users[1].level)} - ${Math.trunc((user.data.cursus_users[1].level % 1) * 100)}%`, 140, 195)
	}
	res.send('<img src="' + canvas.toDataURL() + '" />')
}