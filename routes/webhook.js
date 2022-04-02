var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth');
var webhookhelper = require('../helpers/attachwebhook')

router.post('/', async (req, res) => {
    try {

        if (req.query && req.query.validationtoken) {
            console.log('');
            console.log("---- Outlook is checking web hook checking endpoint")            
            console.log("---- Validation code sent " + req.query.validationtoken);
            res.type('text/plain');
            res.send(req.query.validationtoken);
            
        }
        else {
            console.log('');
            console.log("outlook reporting over webhook")
            if (req.body && req.body.value) {
                var val = req.body.value[0];
                var io = req.app.get('socketio');
                if (io) {
                    console.log(val.ResourceData.Subject)
                    io.emit(req.headers.clientstate, { change: val.ChangeType, subject: val.ResourceData.Subject });
                }
            }
            res.send();
        }

    } catch (error) {
        console.log('ERROR getting token:' + error);
        res.render('error', { error: error });
    }
});

router.get('/attach', function (req, res) {
    if (!req.session) {
        return;
    }
    
    console.log('----------------------------------------');
    console.log("Web hook attach request for session - " + req.sessionID)
    console.log("Existing webhook id - " + req.session.webhookid)

    if (!req.session.webhookid) {
        console.log("- Processing Web Hook Request ")
        webhookhelper.attach(req);
    }
    else {
        console.log("--- Web hook was already created for this session");
    }
    res.redirect('/list');
});

module.exports = router;