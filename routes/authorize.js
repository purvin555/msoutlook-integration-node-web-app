var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth');
var webhookhelper = require('../helpers/attachwebhook')


router.get('/', async (req, res) => {
    var authCode = req.query.code;

    if (!authCode) {
        console.log('/authorize called without a code parameter, redirecting to login');
        res.render('error', { message: 'Sign in to access' });
        return;
    }

    console.log("Authorization Code - " + authCode);

    try {

        var token = await auth.getTokenFromCode(authCode, req, res);
        if (token) {
            req.session.access_token = token.token.access_token;
            req.session.refresh_token = token.token.refresh_token;
            req.session.email = auth.getEmailFromIdToken(token.token.id_token);
        }

        webhookhelper.attach(req, function () {
            res.redirect('/list');
        });

    } catch (error) {

        console.log('ERROR getting token:' + error);
        res.render('error', { error: error });
    }
});

router.get('/signout', function (req, res) {
    webhookhelper.detach(req);
    auth.signOut(req);
    res.redirect('/');
});

module.exports = router;