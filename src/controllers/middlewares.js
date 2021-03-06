const is_auth = (req, res, next) => {;
  if (req.session.role != undefined) next('route')
  else next()
}

const is_ayud = (req, res, next) => {
  if (req.session.role != 'Ayudante') next('route')
  else next()
}

const req_ayud = (req, res, next) => {
  if (req.session.role != 'Ayudante') {
    console.log('sin credenciales');
    res.status(401).send('no autorizado')
  }else next()
}

const is_admin = (req, res, next) => {
  if (req.session.role != 'Admin') next('route')
  else next()
}

const req_admin = (req, res, next) => {
  if (req.session.role != 'Admin') {
    console.log('sin credenciales');
    res.status(401).send('no autorizado')
  }else next()
}

module.exports = {
  is_auth,
  is_ayud,
  req_ayud,
  is_admin,
  req_admin
}