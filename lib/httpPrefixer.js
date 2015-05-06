/*
  Add http prefix
*/

module.exports = function(string) {

  if(typeof string === 'string') {
    var httpRegex = /^http:|^https:/;
    return (!httpRegex.exec(string)) ? "http://" + string : string;
  } else {
    //if it's not a string, an error will get thrown later :)
    return string;
  }

}
