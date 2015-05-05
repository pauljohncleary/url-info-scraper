#!/usr/bin/env node

var request = require('request'),
  cheerio = require('cheerio'),
  linkIsValid = require('./lib/validLink');

function start (url, cb) {
  if(linkIsValid(url)) {
    request(url, function (error, res, body) {
      if(error) {
        return cb({
          error: error
        });
      } else {
        var $ = cheerio.load(body);
        return cb({
          isWebResource: true,
          title: $('title').text(),
          mime: res.headers['content-type'] || res.headers['Content-Type'] || res.headers['Content-type']
        });
      }
    });
  } else {
    return cb({isWebResource: false});
  }
}

module.exports = start;
