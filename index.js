#!/usr/bin/env node

var request = require('request'),
  cheerio = require('cheerio'),
  httpPrefixer = require('./lib/httpPrefixer'),
  linkIsValid = require('./lib/validLink');

function start (link, cb) {
  var url = httpPrefixer(link);
  if(linkIsValid(url)) {

    var options = {
      timeout: 4000,
      url: url
    };

    //use a HEAD request to check the file content header size in case it's a large file (10MB max)
    var maxSize = 5242880;
    request({
        url: url,
        method: "HEAD"
    }, function(error, headRes) {
      if(error) {
        return cb(error, {});
      } else {
        var size = headRes.headers['content-length'],
          mime = headRes.headers['content-type'] || headRes.headers['Content-Type'] || headRes.headers['Content-type'];
        if (size > maxSize) {
          return cb(null, {
            isWebResource: true,
            title: url,
            tooLarge: true,
            mime: mime
          });
        }
        if (mime.substring(1,11) === 'pplication' )  {
          return cb(null, {
            isWebResource: true,
            parsable: false,
            title: url,
            mime: mime
          });
        } else {
          //do a proper request for the HTML content etc. monitoring the size in case someone requests something bigger than 10MB
          var count = 0;
          var requestObject = request(options, function (error, res, body) {
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

          requestObject.on('data', function(data) {
            count += data.length;
            //console.log(count);
            if (count > maxSize) {
              requestObject.abort(); // Abort the response (close and cleanup the stream)
              return cb(null, {isWebResource: true, tooLarge: true, title: url}); //the mime type cannot be trusted!
            }
          });
        }
      }
    });
  } else {
    return cb(null, {isWebResource: false});
  }
}

module.exports = start;
