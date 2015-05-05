'use strict';
var assert = require('assert');
var urlInfoScraper = require('../');

describe('url-info-scraper node module', function () {
  it('must have at least one test', function () {
    urlInfoScraper('http://google.com', function(status) {
      assert(status);
    });
  });
});
