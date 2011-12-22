/**
 * @fileOverview This file has the implementation of a Logger class for {@link cbNetwork}, but it's multipurpose.
 */

/** @ignore */
var colors = require('colors');

/**
 * @class Creates a new logger with the desired prefix and timestamp
 * @requires colors
 *
 * @param {String} [prefix=[Logger] (HH:MM:SS)]   Message to apply to the start of the message %t will be replaced with a timestamp.
 *                                                For example: '[My logger :) [%t]]' Will print [My logger :) [00:42:30]]
 */
function Logger(prefix) {
  this.prefix = prefix || '[Logger]'.cyan + '(%t)';
}

/**
 * @param {String} msg  Message to print
 */
Logger.prototype.write = function (msg) {
  var s = '', d = new Date();
  if (this.prefix) {
    s = this.prefix
    // Apply timestamp
      .replace('%t',
        p(d.getHours())   + ':' +
        p(d.getMinutes()) + ':' +
        p(d.getSeconds()));
  }
  console.log(s + msg);
};

/**
 * @param {String} msg  Message to print green
 */
Logger.prototype.info = function (msg) {
  this.write(msg.green);
};

/**
 * @param {String} msg  Message to print yellow
 */
Logger.prototype.warn = Logger.prototype.notice = function (msg) {
  this.write(msg.yellow);
};

/**
 * @param {String} msg  Message to print red and bold
 */
Logger.prototype.error = Logger.prototype.fatal = function (msg) {
  this.write(msg.red.bold);
};

/** @ignore */
function p(i) {
  return (i < 10 ? '0' : '') + i;
}

exports = module.exports = Logger;