const router = require('express').Router();
const pool = require('../database/postgreSQL')

router.get('/', (req, res) => {
  res.render('index')
});

router.get('/signup', (req, res) => {
  res.render('signup')
});

router.post('/signup/', (req, res) => {
  console.log(req.body);
});

router.get('/signin', (req, res) => {
  res.render('signin')
});

router.post('/signin/', (req, res) => {
  console.log(req.body);
});

router.get('/examen', (req, res) => {
  res.render('examen')
});

router.post('/examen', (req, res) => {
  console.log(req.body);
  res.render('gracias')
});

module.exports = router
