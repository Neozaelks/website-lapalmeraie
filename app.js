const express = require('express');
const path = require('path');

const port = 3000;
const app = express();

// Prevents fingerprinting
app.disable('x-powered-by');

// Sets the static directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// Sets the view engine and the view's directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/////// ROUTES ///////
app.get('/', (req, res) => {
    res.render('index', {currentPage: 'index'});
});

app.get('/candidater', (req, res) => {
    res.render('candidater', {currentPage: 'candidater'});
})


// Start the app
app.listen(port, () => {
    console.log(`Website started and listening on port ${port}`);
});
