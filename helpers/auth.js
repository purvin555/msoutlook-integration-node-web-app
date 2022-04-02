var clientId = 'cefcbd81-50b8-4119-9586-91a2270f92e1';
var clientSecret = 'tkmzGRTDc0pq2a=DiY53V:hLQKqRsM+/';
var redirectUri = 'http://localhost:3000/authorize';

var scopes = [
  'openid',
  'profile',
  'offline_access',
  'https://outlook.office.com/calendars.read'
];

const credentials = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};
var oauth2 = require('simple-oauth2').create(credentials)

module.exports = {
  getAuthUrl: function () {
    var returnVal = oauth2.authorizationCode.authorizeURL({
      redirect_uri: process.env.REDIRECT_URI,
      scope: process.env.APP_SCOPES
    });
    console.log('');
    console.log('Generated auth url: ' + returnVal);
    return returnVal;
  },

  getTokenFromCode: async function (auth_code, request, response) {

    var result = await oauth2.authorizationCode.getToken({
      code: auth_code,
      redirect_uri: redirectUri,
      scope: scopes.join(' ')
    });

    var token = oauth2.accessToken.create(result);
    console.log('Token created: ', token.token);
    return token;
  },

  getEmailFromIdToken: function (id_token) {
    // JWT is in three parts, separated by a '.'
    var token_parts = id_token.split('.');

    // Token content is in the second part, in urlsafe base64
    var encoded_token = new Buffer(token_parts[1].replace('-', '+').replace('_', '/'), 'base64');

    var decoded_token = encoded_token.toString();

    var jwt = JSON.parse(decoded_token);

    // Email is in the preferred_username field
    return jwt.preferred_username
  },

  getTokenFromRefreshToken: function (refresh_token, callback, request, response) {
    var token = oauth2.accessToken.create({ refresh_token: refresh_token, expires_in: 0 });
    token.refresh(function (error, result) {
      if (error) {
        console.log('Refresh token error: ', error.message);
        callback(request, response, error, null);
      }
      else {
        console.log('New token: ', result.token);
        callback(request, response, null, result);
      }
    });
  },

  signOut: function(req){
      if (req && req.session){
        req.session.access_token = undefined;
        req.session.refresh_token = undefined;
        req.session.email = undefined;
        req.session.destroy();
      }
      return;
  }
};