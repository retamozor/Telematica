const router = require('express').Router();

router.get('/', (_req, res) => {
  res.render('index')
});

router.get('/signup', (_req, res) => {
  res.render('signup')
});

router.get('/signin', (_req, res) => {
  res.render('signin')
});

module.exports = router
