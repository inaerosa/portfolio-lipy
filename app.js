const express = require('express');
const app = express();
const path = require('path')
const mailer = require('./modules/mailer')
require('dotenv').config();
const fs = require('fs')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

const dirPath = path.join(__dirname, 'public/pdfs');

const files = fs.readdirSync(dirPath).map((name) => {
	return {
		name: path.basename(name, '.pdf'),
		url: `/pdfs/${name}`,
	};
});

app.get('/', (req, res) => {
    res.redirect('/storyboard')
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.post('/contact', (req, res) => {

    const { email, subject, message } = req.body;

    mailer.sendMail({
        to: process.env.EMAIL_USER,
        from: email,
        subject: subject,
        text: message
    }, (err) => {
        if(err) return res.status(400).send(err.message)
    })
   
    res.redirect('/')
})

app.get('/animation', (req, res) => {
    res.render('animation')
})

// app.get('/characterDesign', (req,res) => {
//     res.render('characterDesign')
// })

app.get('/storyboard', (req, res) => {
    res.render('storyboard');
})

app.get('/writing', (req, res) => {
    res.render('writing', {files})
})

app.listen(process.env.PORT, () => {
    console.log(`Running at http://${process.env.BASE_URL}:${process.env.PORT} `)
})