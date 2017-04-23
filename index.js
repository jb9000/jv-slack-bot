"use strict";

const circle = require("./circle.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

const server = app.listen(8080, () => {
  console.log("Express server listening on port %d in %s mode",
  server.address().port, app.settings.env);
});

/* *******************************
/* HTTP Convert Me Slash Command
/* ***************************** */

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
  /*if (query.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    return;
  }*/
  
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