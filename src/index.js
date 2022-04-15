require('dotenv').config()

const express = require('express'),
  path = require('path'),
  app = express(),
  session = require('express-session'),
  pgPool = require('./database/postgreSQL'),
  pgSession = require('connect-pg-simple')(session),
  { error404 } = require('./controllers/index.conrtoller');
  
  //  Ajustes  //
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));
  app.set('port', process.env.PORT || 8080);
  app.use(express.static(path.join(__dirname, 'public'))); // archivos publicos

  // middleware //
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json())
  app.use(session({
    secret: process.env.SESSION_KY,
    name:'sessionID', resave: true,
    saveUninitialized: true,
    rolling:true,
    store: new pgSession({
      pool: pgPool,
      tableName: 'user_session',
      schemaName: 'hospital'
    }),
    cookie: {
      maxAge: 10*60*1000
    }
  }))
  //  rutas  //
  app.use(require('./routes'));
  app.use('/api', require('./routes/api'))

// 404 handler  //
app.use(error404);

//  servidor http  //
const servidor = app.listen(app.get('port'), () => {
  console.log(`server on port: ${app.get('port')} in ${app.get('env')}`);
});