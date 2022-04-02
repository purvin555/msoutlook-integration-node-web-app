var express = require('express');
var router = express.Router();
var outlook = require('node-outlook');

router.get('/', function (req, res) {
    var itemId = req.query.id;
    var access_token = req.session.access_token;

    if (itemId === undefined || access_token === undefined) {
        res.render('error', { message: "Access Tocken or Item Id not set" });
        return;
    }

    var deleteEventParameters = {
        token: access_token,
        eventId: itemId
    };

    outlook.calendar.deleteEvent(deleteEventParameters, function (error, event) {
        if (error) {
            console.log(error);
            res.render('error', { error: error});
        }
        else {
            res.redirect('/list');
        }
    });
});

module.exports = router;
