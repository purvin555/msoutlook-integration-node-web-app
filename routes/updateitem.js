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

    var newSubject = req.query.subject;
    var newLocation = req.query.location;

    console.log('UPDATED SUBJECT: ', newSubject);
    console.log('UPDATED LOCATION: ', newLocation);

    var updatePayload = {
        Subject: newSubject,
        Location: {
            DisplayName: newLocation
        }
    };

    var updateEventParameters = {
        token: access_token,
        eventId: itemId,
        update: updatePayload
    };

    outlook.calendar.updateEvent(updateEventParameters, function (error, event) {
        if (error) {
                res.render('error', { error: error});
        }
        else {
            res.redirect('/item?id='+ itemId);
        }
    });
});

module.exports = router;


    // var createEventParameters = {
    //     token: access_token,
    //     event: updatePayload
    // };
    //outlook.calendar.createEvent(createEventParameters...)