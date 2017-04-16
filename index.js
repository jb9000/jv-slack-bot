"use strict";

const conversions = require("./conversions");
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
  /*if (query.token !== process.env.SLACK_VERIFICATION_TOKEN) {
    return;
  }*/
  
  //TODO Figure out function for this user request example:
  // /convertme 10 78
  // 10 is the key in our module
  // 78 is the number the user wants to convert into another unit of measurement
  
  if (query.text) {
    let conversion = query.text;
    const digitTest = /^\d+$/;
    
    if(digitTest.test(conversion)) { // not a digit
      response.send("That's incorrect syntax. Please enter a 2 digit number like 10");
      return;
    }
    
    let conversionNumber = conversions[conversion];
    if(!conversionNumber) {
      response.send("Sorry, " + conversionNumber + " is not an available conversion number");
      return;
    }
    
    let data = {
      response_type: "in_channel", // public to the channel
      text: conversion + ": " + conversionNumber
    };
    response.json(data);
  } else {
    let data = {
      response_type: "ephemeral", // private message to user
      text: "How to use /convertme command:",
      attachments: [
      {
        text: "Type a conversion number and number to convert after command, " +
        "/convertme 10 78"
      }  
    ]};
    response.json(data);
  }
  
}