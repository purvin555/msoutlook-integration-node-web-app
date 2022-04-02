var outlook = require('node-outlook');

module.exports = {
    attach(req, callback = null) {
        if (req.sesion && req.session.webhookid) {
            callback();
            return;
        }
        var token = req.session.access_token;
        var email = req.session.email;
        if (token === undefined || email === undefined) {
            throw new Error('attach webhook called while not logged in');
        }
        // Set the endpoint to API v2
        outlook.base.setApiEndpoint(process.env.OUTLOOK_API);

        // // Set the user's email as the anchor mailbox
        // outlook.base.setAnchorMailbox(req.session.email);
        // // Set the preferred time zone
        // outlook.base.setPreferredTimeZone('Eastern Standard Time');
        // NotificationURL: process.env.NGROK_ADDRESS + "/webhook",
        //     console.log(process.env.NGROK_ADDRESS);
        var requestUrl = outlook.base.apiEndpoint() + '/me/subscriptions';
        console.log(requestUrl);
        var payload = {
            "@odata.type": "#Microsoft.OutlookServices.PushSubscription",
            Resource: "me/events?$select=Subject,Organizer,Start,End",//?$select=Subject,Organizer,Start,End", 
            NotificationURL: process.env.NGROK_ADDRESS + "/webhook",
            //NotificationURL: "https://mywebhook.azurewebsites.net/api/send/rojamaroon",
            ChangeType: "Created,Deleted,Updated",
            ClientState: email,
        };

        var apiOptions = {
            url: requestUrl,
            token: token,
            method: 'POST',
            payload: payload
        };

        console.log(">>>> Sending request to attach webhook");
        outlook.base.makeApiCall(apiOptions, function (error, response) {            
            if (error) {
                console.log(JSON.stringify(error));
                console.log('Web Hook Attached Response Error See Above');
            }
            else {
                if (response.statusCode !== 200 && response.statusCode !== 201) {
                    console.log(response);
                    console.log('Web Hook Attached Response Code - ' + response.statusCode);
                }
                else {
                    req.session.webhookid = response.body.Id;
                    req.session.save();
                    console.log("Web hook subscription id " + req.session.webhookid)
                    console.log("Web hook now attached to session -" + req.sessionID);
                }
            }
            if (callback)
                callback();
        });
    },
    
    detach(req) {
        if (req.sesion && !req.session.webhookid) {
            return;
        }
        var token = req.session.access_token;
        var email = req.session.email;
        if (token === undefined || email === undefined) {
            throw new Error('detaching webhook called while not logged in');
        }

        outlook.base.setApiEndpoint(process.env.OUTLOOK_API);
        var requestUrl = outlook.base.apiEndpoint() + `/me/subscriptions('${req.session.webhookid}')`;
        console.log(requestUrl);
        var apiOptions = {
            url: requestUrl,
            token: token,
            method: 'DELETE'
        };

        console.log("=== Sending request to detach webhook - " + req.session.webhookid);
        outlook.base.makeApiCall(apiOptions, function (error, response) {
            if (error) {
                console.log(JSON.stringify(error));
                console.log('Web Hook Attached Response Error See Above');
            }
            else {
                console.log(response.body)
                console.log('Web Hook Detach Response Code - ' + response.statusCode);
            }
        });
    }
};