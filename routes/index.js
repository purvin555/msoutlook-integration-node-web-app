var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Login', signinUrl: auth.getAuthUrl() });
});

module.exports = router;
