## I N T R O

This sample code base covers a submission in response to test allocated by a company. Submission was successful in a sense that it help land a full time gig with that company.

```
T E S T----T E X T

1. Go create an outlook account
2. Add some stuff to the calendar
3. Integrate with the API
4. Create code that does the following:

CREATE WEB APPLICATION THAT
a) Pulls down existing calendar events displays on web page.
b) Allows you to update the events and pushes the update back to the server.
c) Implement a webhook such that when something is changed on outlook.com you get the update on your local web page.

Test for backend with instructions:

https://docs.microsoft.com/en-us/outlook/rest/node-tutorial

```

## T E S T----R E S P O N S E

Quick video overview

https://drive.google.com/file/d/19DDTRF27np6SJXHRgVbASzEGlip_N5zv/view?usp=sharing

- Code bases consist Node JS APIs with routes serving html pages.
- Server is intialized using express framework for Node.
- Socket io server is initialized along with node express intializaton.
- HTML is included in .hbs templates interpersed with handlebars expressions which gets resolved based on template parameters resolved during API calls. 
- The APIs also include endpoints for webhooks. 
- The server will also communicate with clients over sockets during webhook events using socket-io. 
- The html pages served also include javascript that will create socket client connections with socket io server.

## S E T U P 
- Please check .env file in root and apply proper settings for APP_ID,APP_PASSWORD and NGROK_ADDRESS before you spin up server instance.
- App_ID is id created to connect external app to outlook. https://drive.google.com/file/d/1JN2keX2K5zGEfIk178VOYVzHnbwHG1jj/view?usp=sharing
- App_Password is password for that APP_ID.  
- NGROK_ADDRESS  is simply pasting an "HTTPS" link generated once once you bind your local port 4004 to a public address allocated by ngrok. (Download and install ngrok. ngrok http 4004)

## N O T E S

- The web hook subscription gets automatically called post successful signup. If it doesn't happen you will see Web Hook button on the list page. 
- Web hook request will be sent only for one session.
- When outlook reports change to node server it notifies clients using socket.io. The list will not update but you will see message(s) popup and then you will have to manually refresh. 
- Please press Sign Out button to detach webhook and terminate session. This will avoid multiple messages for events when you sign back in.  

## I S S U E S----P E N D I N G----R E S O L U T I O N
- Upon deletion or addition of calendar item it generates extra messages for same event with update word in it. 
- An issue about multiple webhooks getting attached.  If you have multiple signups (say from different browsers),  you will see duplicate entries in message box when you add, update or delete an entry in calendar using https://outlook.live.com/calendar/view .  An issue for which a resolution is pending.