const { error404 } = require('./controllers/index.conrtoller');

const express = require('express'),
  engine = require('ejs-mate'),
  path = require('path'),
  app = express(),
  session = require('express-session');

//  Ajustes  //
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.port || 8080);
app.use(express.static(path.join(__dirname, 'public'))); // archivos publicos

//  rutas  //
app.use(express.urlencoded({ extended: false }));
app.use(express.json())
app.use(session({secret: 'Hty956H#dsj?', resave: true, saveUninitialized: true}))
app.use(require('./routes'));

// 404 handler  //
app.use(error404);

//  servidor http  //
const servidor = app.listen(app.get('port'), () => {
  console.log(`server on port: ${app.get('port')}`);
});