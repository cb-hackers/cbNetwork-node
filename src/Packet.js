/**
* @fileOverview This file has the implementation of {@link Packet} class.
*/

/**
 * Creates a new Buffer. Always define size when creating a new Packet if possible.
 * Writing to a buffer with undefined size causes resize function to create and copy
 * information to a new, bigger, buffer which is slow.
 *
 * @class Packet is used to emulate CoolBasic MemBlock-system that is used in cbNetwork for packet data.
 *
 * @param {Number|Buffer} [input]  the size in bytes to be allocated. The actual size of allocation
 *                                 will actually be the given size + 4 bytes because of internal use.
 *
 */
function Packet (input) {
  if ('number' === typeof input) {
    this.memBlock = new Buffer(input + 4);
  } else if (input instanceof Buffer) {
    this.memBlock = input;
  } else if (input instanceof Packet) {
    this.memBlock = input.memBlock;
  } else {
    this.memBlock = new Buffer(4);
  }
  // First integer is the ID, skip it.
  this.offset = 4;
};

/**
 * Increases the size of the memBlock by the given one. This only allows increasing the size.
 *
 * @param {Number} size  the new size in bytes added to the offset if needed
 */
Packet.prototype.resize = function (size) {
  // Only allow increasement
  if (this.offset + size > this.memBlock.length) {
    var newBuf = new Buffer(this.offset + size);
    this.memBlock.copy(newBuf, 0, 0);
    this.memBlock = newBuf;
  }
};

///////////////////////////
/////////////////// GETTERS
///////////////////////////

/**
 * @returns {Number}  the length of the memblock without the id (first four bytes).
 */
Packet.prototype.getSize = function () {
  return (this.memBlock.length - 4) < 0 ? 0 : this.memBlock.length - 4;
}

/**
 * @returns {Number}  the real length of the memblock.
 */
Packet.prototype.__defineGetter__('length', function (value) {
  return this.memBlock.length;
});


/**
 * Returns an unsigned byte from the memblock and moves the offset accordingly.
 *
 * @returns {Number}  an unsigned byte, 0...255
 */
Packet.prototype.getByte = function () {
  return this.memBlock[this.offset++];
};

/**
 * Returns a signed short from the memblock and moves the offset accordingly.
 *
 * @returns {Number}  a 16-bit signed integer, -32768...32768
 */
Packet.prototype.getShort = function () {
  this.offset += 2;
  return this.memBlock.readInt16LE(this.offset - 2);
};

/**
 * Returns an unsigned short from the memblock and moves the offset accordingly.
 *
 * @returns {Number}  a 16-bit unsigned integer, 0...65535
 */
Packet.prototype.getUShort = function () {
  this.offset += 2;
  return this.memBlock.readUInt16LE(this.offset - 2);
};

/**
 * Returns an integer from the memblock and moves the offset accordingly.
 *
 * @returns {Number}  a 32-bit integer, -2147483647...2147483647
 */
Packet.prototype.getInt = function () {
  this.offset += 4;
  return this.memBlock.readInt32LE(this.offset - 4);
};

/**
 * Returns a float from the memblock and moves the offset accordingly.
 *
 * @returns {Number}  a 32-bit float, 3.4e38...3.4e-38 (7 numbers)
 */
Packet.prototype.getFloat = function () {
  this.offset += 4;
  return this.memBlock.readFloatLE(this.offset - 4);
};

/**
 * Returns a string from the memblock and moves the offset accordingly.
 *
 * @returns {String}
 */
Packet.prototype.getString = function () {
  var len = this.getInt(), str = '';
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(this.memBlock[this.offset++]);
  }
  return str;
};

/**
 * Gets the client id, which is the first integer in memblock.
 *
 * @returns {Number}
 */
Packet.prototype.__defineGetter__('clientId', function (value) {
  return this.memBlock.readInt32LE(0);
});

/////////////////////////
///////////////// PUTTERS
/////////////////////////

/**
 * Puts a byte to the memblock and moves the offset accordingly.
 *
 * @param {Number} value  Byte to write, must be in range 0...255
 * @throws {TypeError}    If value not a Number or not in range
 */
Packet.prototype.putByte = function (value) {
  if ('boolean' === typeof value) {
    // Convert a boolean to a number
    value = Number(value);
  } else if ('number' !== typeof value || value < 0 || value > 255) {
    throw TypeError('Byte to write must be Number and in range 0...255');
  }
  this.resize(1); // Resize memBlock if needed
  this.memBlock[this.offset++] = value;
};

/**
 * Puts a signed short to the memblock and moves the offset accordingly.
 *
 * @param {Number} value  a 16-bit signed integer, -32768...32768
 * @throws {TypeError}    If value not a Number or not in range
 */
Packet.prototype.putShort = function (value) {
  if ('boolean' === typeof value) {
    // Convert a boolean to a number
    value = Number(value);
  } else if ('number' !== typeof value || value < -32768 || value > 32768) {
    throw TypeError('Short to write must be Number and in range -32768...32768');
  }
  this.resize(2); // Resize memBlock if needed
  this.memBlock.writeInt16LE(value, this.offset);
  this.offset += 2;
};

/**
 * Puts an unsigned short to the memblock and moves the offset accordingly.
 *
 * @param {Number} value  a 16-bit unsigned integer, 0...65535
 * @throws {TypeError}    If value not a Number or not in range
 */
Packet.prototype.putUShort = function (value) {
  if ('boolean' === typeof value) {
    // Convert a boolean to a number
    value = Number(value);
  } else if ('number' !== typeof value || value < 0 || value > 65535) {
    throw TypeError('Unsigned Short to write must be Number and in range 0...65535');
  }
  this.resize(2); // Resize memBlock if needed
  this.memBlock.writeUInt16LE(value, this.offset);
  this.offset += 2;
};

/**
 * Puts an integer to the memblock and moves the offset accordingly.
 *
 * @param {Number} value  a 32-bit integer, -2147483648...2147483648
 * @throws {TypeError}    If value not a Number or out of range
 */
Packet.prototype.putInt = function (value) {
  if ('boolean' === typeof value) {
    // Convert a boolean to a number
    value = Number(value);
  } else if ('number' !== typeof value || value < -2147483648 || value > 2147483648) {
    throw TypeError('Integer to write must be Number and in range -2147483648...2147483648');
  }
  this.resize(4); // Resize memBlock if needed
  this.memBlock.writeInt32LE(value, this.offset);
  this.offset += 4;
};

/**
 * Puts a float to the memblock and moves the offset accordingly.
 *
 * @param {Number} value  a 32-bit float, 3.4e38...3.4e-38 (7 numbers)
 * @throws {TypeError}    If value NaN or not a Number
 */
Packet.prototype.putFloat = function (value) {
  if ('boolean' === typeof value) {
    // Convert a boolean to a number
    value = Number(value);
  } else if ('number' !== typeof value || isNaN(value)) {
    throw TypeError('Float to write must be Number and not NaN.');
  }
  this.resize(4); // Resize memBlock if needed
  this.memBlock.writeFloatLE(value, this.offset);
  this.offset += 4;
};

/**
 * Puts a string to the memblock and moves the offset accordingly.
 *
 * @param {String} value  the string to be put to the memblock
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
 *
 * @param {Number} value  client ID, a 32-bit integer
 * @throws {TypeError}    If value NaN or not a Number
 */
Packet.prototype.__defineSetter__('clientId', function (value) {
  if ('number' !== typeof value || isNaN(value)) {
    throw TypeError('ID to write must be Number and not NaN.');
  }
  this.memBlock.writeInt32LE(value, 0);
});

exports = module.exports = Packet;