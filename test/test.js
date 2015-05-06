'use strict';
var assert = require('assert');
var urlInfoScraper = require('../');
var isLinkValid = require('../lib/validLink');

describe('validLink submodule', function () {
  it('must return true for a valid link', function () {
    assert(isLinkValid('http://google.com'));
  });
  it('must return true for a valid https link', function () {
    assert(isLinkValid('https://google.com'));
  });
  it('must return false for an invalid link', function () {
    assert(!isLinkValid('this is not a web link!!'));
  });
  it('must return false for an object', function () {
    assert(!isLinkValid({hello: 'this object is not a weblink'}));
  });
  it('must handle links without an http prefix correctly', function () {
    assert(isLinkValid('google.com'));
    assert(isLinkValid('www.google.co.uk'));
    assert(isLinkValid('google.bz'));
    assert(isLinkValid('ebay%20.com'));
    assert(isLinkValid('www.google.nl/_/chrome/newtab?espv=2&ie=UTF-8'));
    assert(isLinkValid('google.org'));

  });
  it('must return false for obviously invalid links', function () {
    assert(!isLinkValid('go  ogle.  com'));
    assert(!isLinkValid('mailto:someemailaddress@email.com'));
    assert(!isLinkValid('javascript'));
  });
});

describe('url-info-scraper node module', function () {
  it('must return a status object', function (done) {
    urlInfoScraper('http://google.com', function(error, statusObj) {
      assert(typeof statusObj === 'object');
      done();
    });
  });

  it('must return a status object for links without an http prefix', function (done) {
    urlInfoScraper('google.com', function(error, statusObj) {
      assert(typeof statusObj === 'object');
      done();
    });
  });

  it('must return a status object with false in it if provided with a url that is invalid', function (done) {
    urlInfoScraper('THIS IS AN INVALID LINK', function(error, statusObj) {
      assert(!statusObj.isWebResource);
      done();
    });
  });

  it('must return a title in the status object', function (done) {
    urlInfoScraper('http://google.com', function(error, statusObj) {
      assert(statusObj.title);
      done();
    });
  });

  it('must return a mime type in the status object', function (done) {
    urlInfoScraper('http://google.com', function(error, statusObj) {
      assert(statusObj.mime);
      done();
    });
  });

  it('must return a mime type of image for an image resource', function (done) {
    urlInfoScraper('http://lorempixel.com/400/200/', function(error, statusObj) {
      assert.equal(statusObj.mime.substring(0,5), 'image');
      done();
    });
  });

});
