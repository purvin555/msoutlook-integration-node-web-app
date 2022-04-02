var express = require('express');
var router = express.Router();
var auth = require('../helpers/auth');
var moment = require('moment');
var outlook = require('node-outlook');

router.get('/', function (req, res, next) {
  try {
    var access_token = req.session.access_token;
    var refresh_token = req.session.access_token;
    var email = req.session.email;
    
    console.log("Fetching List For Session - " + req.sessionID)

    if (access_token === undefined || refresh_token === undefined) {
      console.log('/main called while not logged in');
      res.redirect("/")
      return;
    }

    getList(req, res);    

  } catch (error) {
    console.log('ERROR getting token:' + error);
    res.render('error', error);
  }
});

function getList(req, res) {
  var token = req.session.access_token;
  var email = req.session.email;
  if (token === undefined || email === undefined) {
    throw new Error('getList called while not logged in');
  }
  console.log(process.env.OUTLOOK_API);
  // Set the endpoint to API v2
  outlook.base.setApiEndpoint(process.env.OUTLOOK_API);
  outlook.base.setAnchorMailbox(req.session.email);
  outlook.base.setPreferredTimeZone('Eastern Standard Time');

  // Use the syncUrl if available
  var requestUrl = req.session.syncUrl;
  if (requestUrl === undefined) {
    // Calendar sync works on the CalendarView endpoint
    requestUrl = outlook.base.apiEndpoint() + '/Me/CalendarView';
  }

  // Set up our sync window from midnight on the current day to
  // midnight 7 days from now.
  var startDate = moment().startOf('day');  
  var endDate = moment(startDate).add(7, 'days');
  startDate = moment(startDate).add(-10, 'days');
  // The start and end date are passed as query parameters
  var params = {
    startDateTime: startDate.toISOString(),
    endDateTime: endDate.toISOString()
  };

  // Set the required headers for sync
  var headers = {
    // Prefer: [
    //   // Enables sync functionality
    //   'odata.track-changes',
    //   // Requests only 5 changes per response
    //   'odata.maxpagesize=5'
    // ]
  };

  var apiOptions = {
    url: requestUrl,
    token: token,
    headers: headers,
    query: params
  };

  //console.log(requestUrl);
  //console.log(apiOptions);
  console.log("______________________________________");
  console.log("Sending request to fetch list of events");
  outlook.base.makeApiCall(apiOptions, function (error, response) {
        
    if (error){
      var err = JSON.stringify(error);
      console.log(err);
      throw new Error(err);
    }

    if (response.statusCode !== 200) {      
      console.log('API Call returned ' + response.statusCode);
      throw new Error("Unexpected status Code" + response.statusCode);
    }
    
      // var nextLink = response.body['@odata.nextLink'];
      // if (nextLink !== undefined) {
      //   req.session.syncUrl = nextLink;
      // }
      // var deltaLink = response.body['@odata.deltaLink'];
      // if (deltaLink !== undefined) {
      //   req.session.syncUrl = deltaLink;
      // }

      var events = response.body.value;
      //console.log(events);
      res.render('list', { title: 'Dashboard', email: email, events: events, webhookid : req.session.webhookid});
  });
}

module.exports = router;
