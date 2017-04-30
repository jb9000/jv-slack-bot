"use strict";

const circle = require("./circle.js");
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

const server = app.listen(process.env.PORT || 3333, () => {
  console.log("Express server listening on port %d in %s mode",
  server.address().port, app.settings.env);
});

// AUTHORIZATION
app.get("/slack", function(req, resp) {
  if (!req.query.code) { // access denied
    resp.redirect("https://circleproperties.herokuapp.com/");
    return;
  }
  var data = {form: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    code: req.query.code
  }};
  request.post("https://slack.com/api.oauth.access", data, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // get authorization token
      let token = JSON.parse(body).access_token;
      
      // redirect to team URL after authorization
      request.post("https://slack.com/api/team.info", {form: {token: token}}, function(error, response, body) {
        if (!error && response.statusCode == 200) {
          if (JSON.parse(body).error == "missing_scope") {
            resp.send("Circle Properties has been added to your team!");
          } else {
            let team = JSON.parse(body).team.domain;
            resp.redirect("http://" + team + ".slack.com");
          }
        }
      });
    }
  });
});


/* *******************************
/* HTTP Circle Bot Slash Command
/* ***************************** */
app.get("/", (request, response) => {
  convertUnits(request.query, response);
});

app.post("/", (request, response) => {
  convertUnits(request.body, response);
});

/*
response:
{ 
  token: '2P429UX-------',
  team_id: 'T1L---',
  team_domain: 'ourtestaccount',
  channel_id: 'C1L---',
  channel_name: 'general',
  user_id: 'U1L----',
  user_name: 'ver2point0',
  command: '/circleproperties',
  text: 'enter a radius as a number',
  response_url: 'https://hooks.slack.com/commands/--- 
}
*/

function convertUnits(query, response) {
  if (query.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    return;
  }
  
  if (query.text) {
    let radius = query.text;
    const digitTest = /^\d+$/;
    
    if(!digitTest.test(radius)) { // not a digit
      response.send(`${radius} is incorrect syntax. Please enter a number for a radius.`);
      return;
    }
    
    let data = {
      response_type: "in_channel", // public to the channel
      text: 
      `You entered a radius of ${radius}.` 
      + `\nThe area of your circle with radius ${radius} is ${circle.area(radius)}.` 
      + `\nThe circumference of your circle with radius ${radius} is ${circle.circumference(radius)}.`
    };
    response.json(data);
  } else {
    let data = {
      response_type: "ephemeral", // private message to user
      text: "Type a radius after the command, e.g. /circleproperties 10"
    };
    response.json(data);
  }
}