/*
  Check if a string is a valid URI
*/

var url = require('url'),
  validUrl = require('valid-url');

function checkValidity(string) {
  try { //this can throw an error if the link isn't actually a string
    var parsedUrl = url.parse(string);
    if( parsedUrl.href.substring(0,5) === 'javas' || parsedUrl.href.substring(0,6) === 'mailto') {
      return false;
    } else if (!validUrl.isWebUri(string)) {
      return false;
    }
  }
  catch(e) {
    return false;
  }

  //it's all goooooood
  return true;
}

module.exports = checkValidity;
