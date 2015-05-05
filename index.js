#!/usr/bin/env node

var request = require('request'),
  //cheerio = require('cheerio'),
  url = require('url'),
  validUrl = require('valid-url');

var statusObj = {};

function inValidateStatus(message) {
  statusObj.status = false;
  statusObj.message = message;
  return statusObj;
}

function checkValidity(link, callback) {
'use strict';
  try { //this can throw an error if the link isn't a string
    var parsedUrl = url.parse(link);
    if( parsedUrl.href.substring(0,5) === 'javas' || parsedUrl.href.substring(0,6) === 'mailto') {
      inValidateStatus('Not a web resource');
    } else if (!validUrl.isWebUri(link)) {
      inValidateStatus('Malformed');
    }
  }
  catch(e) {
    inValidateStatus('Malformed');
  }
  return callback();
}

function start (url) {
  return checkValidity(url, function() {
    if(statusObj === false) {
      return statusObj;
    } else {
      request(url, function (error, response, body) {
        if(error) {
          return inValidateStatus(response.statusCode);
        }
        if (!error && response.statusCode === 200) {
          console.log(body);
        }
      });
      //if ok, send a request
      //parse request response using cheerio for the title, favicon, image etc.
    }
  });
}


module.exports = start;
