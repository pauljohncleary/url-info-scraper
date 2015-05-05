/*
  Check if a string is a valid URI
*/

var url = require('url'),
  validUrl = require('valid-url');

function checkValidity(string) {
  //first, let's do a couple of crude checks on the input, in case it's "almost" a valid link

  //check if it is a single url
  var linkRegex = /^http:|^https:|^www\.|\.com$|\.org$|\.edu$|\.gov$|\.uk$|\.net$|\.ca$|\.de$|\.jp$|\.fr$|\.au$|\.us$|\.ru$|\.ch$|\.it$|\.nl$|\.se$|\.no$|\.es$|\.mil$|\.bz$/i;
  var noSpacesRegex = /\s/;

  if(linkRegex.exec(string) && !noSpacesRegex.exec(string)){
    //ignore any javascript or mailto links that have come through
    if(string.substring(0,5) === 'javas' || string.substring(0,6) === 'mailto') {
      return false;
    }

    //add http if it's missing
    var httpRegex = /^http:|^https:/;
    if (!httpRegex.exec(string)) {
      string = "http://" + string;
    }
  }

  //next, let's try and parse it properly using some "proper" libraries
  try { //this can throw an error if the link isn't actually a string
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
