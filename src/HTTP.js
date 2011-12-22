/**
 * @fileOverview This file has the implementation of {@link HTTP} module.
 */

/** @ignore */
var http = require('http'),
  urlParser = require('url');

/**
 * @namespace Holds static functions for HTTP abstraction that work like cbNetwork equivalents.
 */
var HTTP = {};

/**
 * Creates a HTTP GET request and calls the callback with the results.
 *
 * @requires http, url
 *
 * @param {String} url   Address to GET
 * @param {Function} cb  function (statusCode, data) { } statusCode will be 0 on failure
 */
HTTP.get = function (url, cb) {
  var urlObj = urlParser.parse(url);
  http.get({
    host: urlObj.hostname,
    port: 80,
    path: urlObj.path,
    agent: false
  // Let's wait for the server's response
  }, function (res) {
    var data = '';
    // Some data received
    res.on('data', function (chunk) {
      data += chunk;
    });
    // All done
    res.on('end', function () {
      cb(res.statusCode, data);
    });
  // Something went wrong before we got our response
  }).on('error', function (e) {
    cb(0, e.message);
  });
};

exports = module.exports = HTTP;