#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]

> Retrives a small amount of meta data from a URL


## Install

```sh
$ npm install --save url-info-scraper
```


## Usage

```js
var urlInfoScraper = require('url-info-scraper');

urlInfoScraper('http://en.wikipedia.org/wiki/Wikipedia', function(error, linkInfo) {
  var title = linkInfo.title; //'Wikipedia - Wikipedia, the free encyclopedia'
});
```

The response is an object with the following properties:
```js
{
  isWebResource: boolean, //true if the link is valid
  title: string, //title of the page requested
  mime: string //content-type header of the page e.g. image/jpeg
}
```

## License

MIT © [Paul Cleary](tab.bz)


[npm-image]: https://badge.fury.io/js/url-info-scraper.svg
[npm-url]: https://npmjs.org/package/url-info-scraper
[travis-image]: https://travis-ci.org/pauljohncleary/url-info-scraper.svg?branch=master
[travis-url]: https://travis-ci.org/pauljohncleary/url-info-scraper
[daviddm-image]: https://david-dm.org/pauljohncleary/url-info-scraper.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/pauljohncleary/url-info-scraper
