/*
  Check if a string is a valid URI
*/

var url = require('url'),
  validUrl = require('valid-url');

function checkValidity(string) {
  //ignore anything with spaces
  var noSpacesRegex = /\s/;

  //next, let's try and parse it properly using some "proper" libraries
  try { //this can throw an error if the link isn't actually a string

    if(string.substring(0,5) === 'javas' || string.substring(0,6) === 'mailto' || noSpacesRegex.exec(string)) {
      return false;
    }

    var parsedUrl = url.parse(string);
    if(parsedUrl) {
      if (!validUrl.isWebUri(string)) {
        return false;
      }
    } else {
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
