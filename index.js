#!/usr/bin/env node

var request = require('request'),
  cheerio = require('cheerio'),
  httpPrefixer = require('./lib/httpPrefixer'),
  linkIsValid = require('./lib/validLink');

function start (link, cb) {
  var url = httpPrefixer(link);
  if(linkIsValid(url)) {
    request(url, function (error, res, body) {
      if(error) {
        return cb(error, {});
      } else {
        var $ = cheerio.load(body);
        return cb(null, {
          isWebResource: true,
          title: $('title').text(),
          mime: res.headers['content-type'] || res.headers['Content-Type'] || res.headers['Content-type']
        });
      }
    });
  } else {
    return cb(null, {isWebResource: false});
  }
}

module.exports = start;
