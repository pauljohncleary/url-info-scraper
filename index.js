#!/usr/bin/env node

var request = require('request'),
  metadata = require('./lib/metadata'),
  httpPrefixer = require('./lib/httpPrefixer'),
  linkIsValid = require('./lib/validLink');

function start (link, cb) {
  var url = httpPrefixer(link);
  if(linkIsValid(url)) {

    var responseObject = {
      isWebResource: true,
      title: url,
      tooLarge: false,
      parsable: true,
      mime: false
    };

    var options = {
      timeout: 4000,
      url: url
    };

    //use a HEAD request to check the file content header size in case it's a large file (5MB max)
    var maxSize = 5242880;
    request({
        url: url,
        method: "HEAD"
    }, function(error, headRes) {
      if(error) {
        return cb(error, {});
      } else {
        var size = headRes.headers['content-length'];
        responseObject.mime = headRes.headers['content-type'] || headRes.headers['Content-Type'] || headRes.headers['Content-type'] || '';
        if (size > maxSize) {
          responseObject.tooLarge = true;
          return cb(null, responseObject);
        }
        if (responseObject.mime.substring(1,11) === 'pplication' )  {
          responseObject.parsable = false;
          return cb(null, responseObject);
        } else {
          //do a proper request for the HTML content etc. monitoring the size in case someone requests something bigger than 10MB
          var count = 0;

          var requestObject = request(options, function (error, res, body) {
            if(error) {
              return cb(error, {});
            } else {
              metadata.getMeta(res.headers, body, url, function(err, metadata) {
                responseObject.title = metadata.title;
                responseObject.mime = metadata.mime;
                responseObject.faviconUrl = metadata.faviconUrl;
                return cb(null, responseObject);
              });
            }
          });

          requestObject.on('data', function(data) {
            count += data.length;
            if (count > maxSize) {
              requestObject.abort(); // Abort the response (close and cleanup the stream)
              responseObject.tooLarge = true;
              return cb(null, responseObject);
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
