const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const botdiscord = require('./botdiscord.js')
const axios = require('axios')
const querystring = require('querystring');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const port = 3000;
const app = express();


const regexMcNickname = RegExp("^[a-zA-Z0-9_]{1,16}$");
const regexDiscordNickname = RegExp("^.{2,32}#[0-9]{4}$");
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

// Enables verbose if not in production
if (process.env.NODE_ENV !== 'production') app.enable('verbose errors');


/////// PAYPAL ///////
const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', querystring.stringify({
      grant_type: 'client_credentials'
    }), {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'fr_FR',
        'Content-Type': 'application/json'
      },
      auth: {
        username: process.env.PAYPAL_ID,
        password: process.env.PAYPAL_SECRET
      }
    }).then(res => {
      resolve(res.data.access_token)
    }).catch(err => {
      reject(err.response.data)
    })
  })
}


/////// DISCORD ///////
botdiscord.start();


/////// ROUTES ///////
app.get('/', (req, res) => {
  res.render('index', { currentPage: 'index' });
});

app.get('/donations', (req, res) => {
  res.render('donations', { currentPage: 'donations' });
})

app.get('/votes', (req, res)  => {
  res.render('votes', { currentPage: 'votes'});
});

app.get('/candidater', (req, res) => {
  res.render('candidater', { currentPage: 'candidater' });
});

app.get('/tutoriel', (req, res) => {
  res.render('tutoriel', { currentPage: 'tutoriel' });
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
      const ageValidity = regexFormAge.test(req.body.form.age)
      const godfathersValidity = req.body.form.godfathers === "" || regexGodfathers.test(req.body.form.godfathers)
      const foundOutValidity = req.body.form.foundOut === "" || req.body.form.foundOut.length <= 256
      const applyValidity = req.body.form.apply !== "" && req.body.form.apply.length <= 2048
  
      const jsonBoolObject = {
        success: true,
        form: {
          mcNickname: mcNicknameValidity,
          discordNickname: discordNicknameValidity,
          age: ageValidity,
          godfathers: godfathersValidity,
          foundOut: foundOutValidity,
          apply: applyValidity
        },
        formValidity: mcNicknameValidity && discordNicknameValidity && ageValidity && godfathersValidity && foundOutValidity && applyValidity,
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

app.post('/create-donation', (req, res) => {
  getAccessToken().then(accessToken => {
    axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'EUR',
          value: req.body.amount
        },
        payment_instruction: {
          disbursement_mode: 'INSTANT'
        }
      }]
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      res.json({ id: response.data.id })
    }).catch(error => {
      console.log(error.response.data)
      res.sendStatus(500)
    });
  }).catch(error => {
    console.error(error)
    res.sendStatus(500)
  });
});

app.post('/capture-donation/:id', (req, res) => {
  const orderId = req.params.id;
  getAccessToken().then(accessToken => {
    axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {}, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      res.json({ status: 'success' })
    }).catch(error => {
      console.log(error.response.data)
      res.sendStatus(500)
    });
  }).catch(error => {
    console.error(error)
    res.sendStatus(500)
  });
});


// Error Handling
app.use((req, res, next) => {
  res.status(404);

  res.format({
    html: function () {
      res.render('404');
    },
    json: function () {
      res.json({ error: 'Not found' });
    },
    default: function () {
      res.type('txt').send('Not found');
    }
  });
});

app.use((err, req, res, next) => {
  err.status = err.status || 500;
  res.status(err.status);
  res.render('error', { error: err });
});


// Start the app
const server = app.listen(port, () => {
  console.log(`Website successfully started listening on port ${port}`);
});


// Graceful Shutdown
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function shutdown() {
  console.log('Gracefully shutting down');
  server.close(() => {
    botdiscord.stop();
    sleep(1000).then(() => process.exit(0));
  });
}

process.on('exit', () => shutdown());
process.on('SIGINT', () => shutdown());
process.on('SIGTERM', () => shutdown());
process.on('SIGUSR1', () => shutdown());
process.on('SIGUSR2', () => shutdown());
process.on('uncaughtException', () => shutdown());
