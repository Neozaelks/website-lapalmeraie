const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const botdiscord = require('./botdiscord.js')

const port = 3000;
const app = express();


const regexMcNickname = RegExp("^[a-zA-Z0-9_]{1,16}$");
const regexDiscordNickname = RegExp("^.{2,32}#[0-9]{4}$");
const regexFormEmail = RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");
const regexFormAge = RegExp("^[0-9]{1,2}$");
const regexGodfathers = RegExp("^[a-zA-Z0-9_]{1,16}( [a-zA-Z0-9_]{1,16})* ?$");


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

app.post('/candidater', (req, res) => {
  // req.body > element json qui contient la candidature, envoyée par le serveur.
  var JSONBoolResponse = {
    formMcNickname: regexMcNickname.test(req.body.formMcNickname),
    formDiscordNickname: regexDiscordNickname.test(req.body.formDiscordNickname),
    formEmail: regexFormEmail.test(req.body.formEmail),
    formAge: regexFormAge.test(req.body.formAge),
    formGodfathers: req.body.formGodfathers === "" || regexGodfathers.test(req.body.formGodfathers),
    formApply: req.body.formApply !== ""
  }
  var JSONCandidature = req.body
  res.send(JSONBoolResponse);
  botdiscord.printCandidature(JSONBoolResponse, JSONCandidature)
});


// Start the app
app.listen(port, () => {
    console.log(`Website started and is listening on port ${port}`);
});
