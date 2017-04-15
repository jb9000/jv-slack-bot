"use strict";

const express = require("express");
const bodyParser = require("body-parse");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded( { extended: true } ));

const server = app.listen(3000, () => {
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
  command: '/convertme',
  text: 'p2k',
  response_url: 'https://hooks.slack.com/commands/--- 
}
*/

function convertUnits(query, response) {
  
}
