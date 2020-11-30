const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const botdiscord = require('./botdiscord.js')
const axios = require('axios')
const querystring = require('querystring');

const port = 3000;
const app = express();


const regexMcNickname = RegExp("^[a-zA-Z0-9_]{1,16}$");
const regexDiscordNickname = RegExp("^.{2,32}#[0-9]{4}$");
const regexFormEmail = RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
const regexFormAge = RegExp("^[0-9]{1,2}$");
const regexGodfathers = RegExp("^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16}){0,2}$");


// Prevents fingerprinting
app.disable('x-powered-by');

// Sets the body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Sets the static directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Sets the view engine and the view's directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/////// DISCORD ///////
botdiscord.start()

// kill the bot


/////// ROUTES ///////
app.get('/', (req, res) => {
  res.render('index', { currentPage: 'index' });
});

app.get('/candidater', (req, res) => {
  res.render('candidater', { currentPage: 'candidater' });
});

app.get('/tutorial', (req, res) => {
  res.render('tutorial', { currentPage: 'tutorial' });
});

app.post('/candidater', (req, res) => {
  axios.post('https://www.google.com/recaptcha/api/siteverify', querystring.stringify({
    secret: process.env.RECAPTCHA_SECRET,
    response: req.body.token
  })).then(response => {
    if(response.data.success && response.data.score > 0.5){
      // req.body > element json qui contient la candidature, envoyée par le serveur.
      const mcNicknameValidity = regexMcNickname.test(req.body.form.mcNickname)
      const discordNicknameValidity = regexDiscordNickname.test(req.body.form.discordNickname)
      const emailValidity = regexFormEmail.test(req.body.form.email)
      const ageValidity = regexFormAge.test(req.body.form.age)
      const godfathersValidity = req.body.form.godfathers === "" || regexGodfathers.test(req.body.form.godfathers)
      const foundOutValidity = req.body.form.foundOut === "" || req.body.form.foundOut.length <= 256
      const applyValidity = req.body.form.apply !== "" && req.body.form.apply.length <= 2048
  
      const jsonBoolObject = {
        success: true,
        form: {
          mcNickname: mcNicknameValidity,
          discordNickname: discordNicknameValidity,
          email: emailValidity,
          age: ageValidity,
          godfathers: godfathersValidity,
          foundOut: foundOutValidity,
          apply: applyValidity
        },
        formValidity: mcNicknameValidity && discordNicknameValidity && emailValidity && ageValidity && godfathersValidity && foundOutValidity && applyValidity,
        discordPresence: discordNicknameValidity && botdiscord.isUserPresent(req.body.form.discordNickname)
      }
  
      if(jsonBoolObject.formValidity && jsonBoolObject.discordPresence){
        botdiscord.printCandidature(req.body.form)
      }
  
      res.send(jsonBoolObject);
    }else{
      res.send({ success: false })
    }
  })
});


// Start the app
app.listen(port, () => {
  console.log(`Website started and is listening on port ${port}`);
});
