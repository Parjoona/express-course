const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

let app = express();

// HBS uses
// Gets partials folder for HBS
hbs.registerPartials(__dirname + '/views/partials');
// Uses HBS as view engine, can use gulp for example.
app.set('view engine', 'hbs');

// maintenance
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
// });

// next = checks if middleware is finished - next();
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} '${req.url}'`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    (err) ? console.log('Unable to append server.log'): ''
  })
  next();
});
// HBS always looks for helpers first if calling methods.
// Uses the name variable as a caller, 2nd is a callback returner
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// Gets a specific site for the / (root), and passes values through.
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Homepage',
    welcomeMessage: 'Welcome to my site!',
  });
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    404: 'not found'
  });
});

// Use express to choose which main folder to use
// Middleware
app.use(express.static(__dirname + '/public'));

// Making express listen for connection
app.listen(port, () => {
  console.log(`Server @ localhost:${port}`)
});
