#!/usr/bin/env node

var request = require('request'),
  cheerio = require('cheerio'),
  url = require('url'),
  validUrl = require('valid-url');

function start (url) {
  return checkValidity(url, function(statusObj, link) {
    if(statusObj === false) {
      return statusObj;
    } else {
      //if ok, send a request
      //parse request response using cheerio for the title, favicon, image etc.
    }
  });
}

function checkValidity(link, callback) {
'use strict';
  var statusObj = {};

  function inValidateObj(statusObj, reason) {
    statusObj.status = false;
    statusObj.reason = reason;
  }

  //this can throw an error if the link isn't a string
  try {
    var parsedUrl = url.parse(link);

    if( parsedUrl.href.substring(0,5) === 'javas' || parsedUrl.href.substring(0,6) === 'mailto') {
      inValidateObj(statusObj, 'Not a web resource');
    }

    if (!validUrl.isWebUri(link)) {
      inValidateObj(statusObj, 'Malformed');
    }
  }
  catch(e) {
    inValidateObj(statusObj, 'Malformed');
  }

  return callback(statusObj);
}

module.exports = start;
