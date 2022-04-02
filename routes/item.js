var express = require('express');
var router = express.Router();
var outlook = require('node-outlook');

router.get('/', function (req, res) {
    var itemId = req.query.id;
    var access_token = req.session.access_token;
    var email = req.session.email;

    if (itemId === undefined || access_token === undefined) {
        res.render('error', { message: "Access Tocken or Item Id not set" });
        return;
    }

    var select = {
        '$select': 'Subject,Attendees,Location,Start,End,IsReminderOn,ReminderMinutesBeforeStart'
    };

    var getEventParameters = {
        token: access_token,
        eventId: itemId,
        odataParams: select
    };

    outlook.calendar.getEvent(getEventParameters, function (error, event) {
        if (error) {
            res.render('error', { error: error });
        }
        else {

            if (event && event.Attendees)
                event.Attendees2 = getAttendees2(event.Attendees)
            res.render('item', { email: email, event: event });
        }
    });
});

function getAttendees2(attendees) {
    var displayStrings = {
        required: '',
        optional: '',
        resources: ''
    };

    attendees.forEach(function (attendee) {
        var attendeeName = (attendee.EmailAddress.Name === undefined) ?
            attendee.EmailAddress.Address : attendee.EmailAddress.Name;
        switch (attendee.Type) {
            // Required
            case "Required":
                if (displayStrings.required.length > 0) {
                    displayStrings.required += '; ' + attendeeName;
                }
                else {
                    displayStrings.required += attendeeName;
                }
                break;
            // Optional
            case "Optional":
                if (displayStrings.optional.length > 0) {
                    displayStrings.optional += '; ' + attendeeName;
                }
                else {
                    displayStrings.optional += attendeeName;
                }
                break;
            // Resources
            case "Resource":
                if (displayStrings.resources.length > 0) {
                    displayStrings.resources += '; ' + attendeeName;
                }
                else {
                    displayStrings.resources += attendeeName;
                }
                break;
        }
    });

    return displayStrings;
}

module.exports = router;
