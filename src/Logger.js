/**
 * @fileOverview This file has the implementation of a Logger class for {@link cbNetwork}, but it's multipurpose.
 */

/** @ignore */
var colors = require('colors');

/**
 * @class Creates a new logger with the desired prefix and timestamp
 * @requires colors
 *
 * @param {String} [prefix]   Message to apply to the start of the message %t will be replaced with a timestamp.
 *                                                For example: '[My logger :) [%t]]' Will print [My logger :) [00:42:30]]
 */
function Logger(prefix) {
  this.prefix = prefix || '';
}

/**
 * @param {String} msg  Message to print
 */
Logger.prototype.write = function () {
  var prfx = ''
    , d = new Date()
    , msg = arguments[0]
    , args;
  // Create prefix
  if (this.prefix) {
    prfx = this.prefix
    // Apply timestamp
      .replace('%t',
        p(d.getHours())   + ':' +
        p(d.getMinutes()) + ':' +
        p(d.getSeconds()));
  }
  // Handle vars in message
  if (arguments.length > 1) {
    // convert it into a real array
    args = Array.prototype.slice.call(arguments, 1);
    for (var i = args.length; i--;) {
      msg = msg.replace(new RegExp('%' + i, 'g'), args[i]);
    }
  }
  
  console.log(prfx + msg);
};

/**
 * @param {String} msg     Message to print with a green [INFO]-tag
 * @param {String} [var0]  Variable to replace %0 from msg
 * @param {String} [var1]  Variable to replace %1 from msg
 * @param {String} [varN]  Variable to replace %n from msg and so forth
 */
Logger.prototype.info = function () {
  arguments[0] = '[INFO] '.green + arguments[0];
  this.write.apply(this, arguments);
};

/**
 * @param {String} msg  Message to print with a yellow [WARN]-tag
 * @param {String} [var0]  Variable to replace %0 from msg
 * @param {String} [var1]  Variable to replace %1 from msg
 * @param {String} [varN]  Variable to replace %n from msg and so forth
 */
Logger.prototype.warn = function () {
  arguments[0] = '[WARN] '.yellow + arguments[0];
  this.write.apply(this, arguments);
};

/**
 * @param {String} msg  Message to print with a yellow [NOTICE]-tag
 * @param {String} [var0]  Variable to replace %0 from msg
 * @param {String} [var1]  Variable to replace %1 from msg
 * @param {String} [varN]  Variable to replace %n from msg and so forth
 */
Logger.prototype.notice = function () {
  arguments[0] = '[NOTICE] '.yellow + arguments[0];
  this.write.apply(this, arguments);
};

/**
 * @param {String} msg  Message to print with a red & bold [ERROR]-tag
 * @param {String} [var0]  Variable to replace %0 from msg
 * @param {String} [var1]  Variable to replace %1 from msg
 * @param {String} [varN]  Variable to replace %n from msg and so forth
 */
Logger.prototype.error = function () {
  arguments[0] = '[ERROR] '.red.bold + arguments[0];
  this.write.apply(this, arguments);
};

/**
 * @param {String} msg  Message to print with a red & bold [FATAL]-tag
 * @param {String} [var0]  Variable to replace %0 from msg
 * @param {String} [var1]  Variable to replace %1 from msg
 * @param {String} [varN]  Variable to replace %n from msg and so forth
 */
Logger.prototype.fatal = function () {
  arguments[0] = '[FATAL] '.red.bold + arguments[0];
  this.write.apply(this, arguments);
};

/** @ignore */
function p(i) {
  return (i < 10 ? '0' : '') + i;
}

exports = module.exports = Logger;