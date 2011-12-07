/**
 * Net is used to emulate CoolBasic MemBlock that is used in cbNetwork
 *
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

exports.Net = Net;

/**
 * Creates a new Buffer.
 *
 * @param {Number|Buffer} input  is the size in bytes to be allocated
 */
function Net (input) {
  // If it's a number
  this.memBlock = undefined;
  if ('number' === typeof input) {
    this.memBlock = new Buffer(input + 4);
  } else if (input instanceof Buffer) {
    this.memBlock = input;
  } else {
    throw Error('First argument must be a number or a buffer.');
  }
  this.offset = 4;
};

/**
 * Sets the memblocks size to the one given. This only allows increasing the size.
 *
 * @param {Number} size  is the new size in bytes
 */
Net.prototype.resize = function (size) {
  // Only allow increasement
  if (this.offset + size > this.memBlock.length) {
    this.memBlock = this.memBlock.slice(0, this.offset + size);
  }
};

/**
 * Returns a byte from the memblock and moves the offset accordingly
 */
Net.prototype.__defineGetter__('byte', function () {
  return this.memBlock[this.offset++];
});

/**
 * Returns an int from the memblock and moves the offset accordingly
 */
Net.prototype.__defineGetter__('integer', function () {
  this.offset += 4;
  return this.memBlock.readInt32LE(this.offset - 4);
});

/**
 * Returns a string from the memblock and moves the offset accordingly
 */
Net.prototype.__defineGetter__('string', function () {
  var len = this.integer,
    str = this.memBlock.toString('utf8', this.offset, this.offset + len);
  this.offset += len;
  return str;
});

/**
 * Puts a byte to the memblock and moves the offset accordingly
 *
 * @param data  byte to write 0-255 
 */
Net.prototype.__defineSetter__('byte', function (value) {
  this.memBlock[this.offset++] = value;
});

/**
 * Puts an int to the memblock and moves the offset accordingly
 */
Net.prototype.__defineSetter__('integer', function (value) {
  this.offset += 4;
  return this.memBlock.writeInt32LE(value, this.offset - 4);
});