const express = require('express');
const path = require('path')
const app = express();
const port = 3000;
const morgan = require('morgan')
const handlebars = require('express-handlebars');
const dotenv = require('dotenv')
require('dotenv').config();
const session = require('express-session');

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded(
  {
    extended: true
  }
));
app.use(express.json());
const route = require("./routes");
// Sử dụng session middleware
app.use(session({
  secret: 'thugom_web_admin',
    resave: false,
  saveUninitialized: true
}));
//Template engine
app.engine('hbs', handlebars({
  extname: 'hbs',
  helpers: {
    eq: function(v1, v2) {
      return v1 === v2;
    }
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));
route(app);
app.use(morgan('combined'));

app.listen(port, () => console.log(`App listening to port ${port}`));