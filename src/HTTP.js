/**
 * HTTP abstraction that works like cbNetwork equivalent
 *
 * @requires http, url
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

var http = require('http'),
  urlParser = require('url');

/**
 * Creates a HTTP GET request and calls the callback with the results
 *
 * @param {String} url   Address to GET
 * @param {Function} cb  function (statusCode, data) { } statusCode will be 0 on failure
 */
exports.get = function (url, cb) {
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
