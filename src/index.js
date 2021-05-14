const engine = require('ejs-mate');
const express = require('express');
const path = require('path');

const app = express();
//  Ajustes  //
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('port', process.env.port || 8080);
app.use(express.static(path.join(__dirname, 'public'))); // archivos publicos

//  rutas  //
app.use(require('./routes'));

// 404 handler  //
app.use((req, res) => {
  res.status(404).render('404');
});

//  servidor http  //
const servidor = app.listen(app.get('port'), () => {
  console.log(`server on port: ${app.get('port')}`);
});