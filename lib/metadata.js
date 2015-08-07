var metadata = function() {
  var getMime = function(headers) {
    return headers['content-type'] || headers['Content-Type'] || headers['Content-type'];
  }

  var cheerio = require('cheerio'),
    request = require('request'),
    url = require('url');

  //takes headers and body, returns the title, mime type and favicon url
  var getMeta = function(headers, body, address, callback) {
    var responseObject = {},
      $ = cheerio.load(body),
      error = null,
      parsedUrl = url.parse(address),
      root = parsedUrl.protocol + "//" + parsedUrl.host,
      fallbackIcon = root + '/favicon.ico',
      iconTag = '';

    responseObject.faviconUrl = null,
    responseObject.title = $('title').text();
    responseObject.mime = getMime(headers)

    if($('link[rel="shortcut icon"]').length) {
      iconTag = $('link[rel="shortcut icon"]');
    } else {
      iconTag = $('link[rel=icon]')
    }

    // using the attr method of the cheerio/jquery object to get href. 
    // in case of multiple iconTag elements, it will use the first one
    responseObject.faviconUrl = iconTag.attr('href') || null

    // resolving the url
    // this is in case the icon path is a relative url
    if(responseObject.faviconUrl){
      responseObject.faviconUrl = url.resolve(address,responseObject.faviconUrl);
    }

    //if there's no icon in the HTML, try root/favicon.ico and see if that 200's
    if(!responseObject.faviconUrl) {
      pingFavicon(fallbackIcon, function(error, ok) {
        if(ok) {
          responseObject.faviconUrl = fallbackIcon;
          return callback(error, responseObject);
        } else {
          return callback(error, responseObject);
        }
      });
    } else {
      return callback(null, responseObject);
    }
  }

  function pingFavicon(root, callback) {
    request(root, function(error, res, body) {
      if (error) {
        return callback(error)
      };
      callback(null, res.statusCode === 200);
    });
  }

  return {
    getMime: getMime,
    getMeta: getMeta
  }
}();

module.exports = metadata;
