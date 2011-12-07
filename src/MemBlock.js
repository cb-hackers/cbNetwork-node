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
  if ('number' === typeof input) {
    this.memBlock = new Buffer(input + 4);
  } else if (input instanceof Buffer) {
    this.memBlock = input;
  } else {
    this.memBlock = new Buffer(0);
  }
  this.offset = 4;
};

/**
 * Increases the size of the memBlock by the given one. This only allows increasing the size.
 *
 * @param {Number} size  is the new size in bytes added to the offset
 */
Net.prototype.resize = function (size) {
  // Only allow increasement
  if (this.offset + size > this.memBlock.length) {
    var newBuf = new Buffer(this.offset + size);
    this.memBlock.copy(newBuf, 0, 0);
    this.memBlock = newBuf;
  }
};

////////////////////////////
/////////////////// GETTERS
////////////////////////////

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
    str = this.memBlock.toString('ascii', this.offset, this.offset + len);
  this.offset += len;
  return str;
});

////////////////////////////
/////////////////// SETTERS
////////////////////////////

/**
 * Puts a byte to the memblock and moves the offset accordingly
 *
 * @param data  byte to write 0-255 
 */
Net.prototype.__defineSetter__('byte', function (value) {
  this.resize(1); // Resize memBlock if needed
  this.memBlock[this.offset++] = value;
});

/**
 * Puts an int to the memblock and moves the offset accordingly
 */
Net.prototype.__defineSetter__('integer', function (value) {
  this.resize(4); // Resize memBlock if needed
  this.memBlock.writeInt32LE(value, this.offset);
  this.offset += 4;
});

/**
 * Puts a string to the memblock and moves the offset accordingly
 */
Net.prototype.__defineSetter__('string', function (value) {
  if ('string' !== typeof value) {throw TypeError();}
  var len = value.length;
  this.integer = len;
  this.resize(len); // Resize memBlock if needed
  this.memBlock.write(value, this.offset, this.offset + len, 'ascii');
  this.offset += len;
});