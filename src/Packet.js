/**
 * Packet is used to emulate CoolBasic MemBlock-system that is used in cbNetwork for packet data
 *
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

exports.Packet = Packet;

/**
 * Creates a new Buffer.
 *
 * @param {Number|Buffer} input  is the size in bytes to be allocated
 */
function Packet (input) {
  // If it's a number
  if ('number' === typeof input) {
    this.memBlock = new Buffer(input + 4);
  } else if (input instanceof Buffer) {
    this.memBlock = input;
  } else {
    this.memBlock = new Buffer(4);
  }
  this.offset = 4;
  this.sender = undefined;
};

/**
 * Increases the size of the memBlock by the given one. This only allows increasing the size.
 *
 * @param {Number} size  is the new size in bytes added to the offset
 */
Packet.prototype.resize = function (size) {
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
 * Returns an unsigned byte from the memblock and moves the offset accordingly
 */
Packet.prototype.getByte = function () {
  return this.memBlock[this.offset++];
};

/**
 * Returns an unsigned int from the memblock and moves the offset accordingly
 */
Packet.prototype.getInt = function () {
  this.offset += 4;
  return this.memBlock.readUInt32LE(this.offset - 4);
};

/**
 * Returns a string from the memblock and moves the offset accordingly
 */
Packet.prototype.getString = function () {
  var len = this.getInt(),
    str = this.memBlock.toString('ascii', this.offset, this.offset + len);
  this.offset += len;
  return str;
};

/**
 * Gets the client id, which is the first integer in memblock
 */
Packet.prototype.__defineGetter__('clientId', function (value) {
  return this.memBlock.readInt32LE(0);
});

////////////////////////////
/////////////////// PUTTERS :P
////////////////////////////
// TODO: Add checks for values e.g. byte is 0-255

/**
 * Puts a byte to the memblock and moves the offset accordingly
 *
 * @param data  byte to write 0-255 
 */
Packet.prototype.putByte = function (value) {
  this.resize(1); // Resize memBlock if needed
  this.memBlock[this.offset++] = value;
};

/**
 * Puts an int to the memblock and moves the offset accordingly
 */
Packet.prototype.putInt = function (value) {
  this.resize(4); // Resize memBlock if needed
  this.memBlock.writeInt32LE(value, this.offset);
  this.offset += 4;
};

/**
 * Puts a string to the memblock and moves the offset accordingly
 */
Packet.prototype.putString = function (value) {
  if ('string' !== typeof value) {throw TypeError('Value must be a string');}
  var len = value.length;
  this.putInt(len);
  this.resize(len); // Resize memBlock if needed
  this.memBlock.write(value, this.offset, this.offset + len, 'ascii');
  this.offset += len;
};

/**
 * Puts the client id as the first integer in the memblock.
 */
Packet.prototype.__defineSetter__('clientId', function (value) {
  this.memBlock.writeInt32LE(value, 0);
});
