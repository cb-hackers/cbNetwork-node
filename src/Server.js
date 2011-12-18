/**
 * @fileOverview This file has the implementation of {@link Server} and {@link Client} classes.
 */

/** @ignore */
var dgram = require('dgram'),
  EventEmitter = process.EventEmitter,
  Packet = require('./Packet').Packet;

/**
 * A constructor for a new client.
 * @private
 *
 * @class Includes client information, message and a reply function for convenience.
 *
 * @param {String} address  Client's address
 * @param {Number} port     Client's port
 * @param {Number} id       Client's unique identifier
 * @param {Packet} data     Client's message to the server
 * @param {UDP} _sock       Reference to server's UDP socket (used for answering to the client)
 *
 * @property {String} address  Client's address
 * @property {Number} port     Client's port
 * @property {Number} id       Client's unique identifier
 * @property {Packet} data     Client's message to the server
 * @property {UDP} _sock       Reference to server's UDP socket (used for answering to the client)
 */
function Client(address, port, id, data, sock) {
  this.address = address;
  this.port = port;
  this.id = id;
  this.data = data;
  this._sock = sock;
}

/**
 * Reply function replies to the client and automagically assigns correct client ID for the packet.
 *
 * @param {Packet} data  Data to send to client
 */
Client.prototype.reply = function (data) {
  if (!data instanceof Packet) {throw Error('Data must be a Packet object.');}
  data.clientId = this.id;
  this._sock.send(data.memBlock, 0, data.memBlock.length, this.port, this.address, function (err) {
    if (err) {console.log(err);}
  });
};

/**
 * Creates a new server.
 *
 * @class Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 * @requires dgram, {@link Packet}
 *
 * @param {Number} port        Port to bind to.
 * @param {String} [address]   Address to attach to.
 */
function Server(port, address) {
  var self = this;
  this._clients = {};
  this._clientCount = 0;
  this._sock = dgram.createSocket('udp4');
  this._sock.on('message', function (msg, peer) {
    var data = new Packet(new Buffer(msg)), client;
    if( data.clientId === 0 ) {
      // Create a new client
      client = new Client(peer.address, peer.port, self._clientCount + 1, data, self._sock);
      self._clients[++self._clientCount] = client;
    } else {
      // Already exists! Update port and data
      client = self._clients[data.clientId];
      client.port = peer.port;
      client.data = data;
    }
    // Tell the server that we have a new message!
    self.emit('message', client);
  });

  // Handle errors. Neat!
  this._sock.on('error', function (e) {
    console.log('UDP ERROR');
    console.log(e);
    self.close(); // Abandon ship!
  });
  this._sock.on('close', function () {
    console.log('Server closed gracefully.');
  });

  // Bind the server
  this._sock.bind(port, address);
  console.log("Server listening on " + (address ? address : '0.0.0.0') + ":" + port);
}

Server.prototype.__proto__ = EventEmitter.prototype;

/** Closes the socket abandoning all clients. */
Server.prototype.close = function () {
  this._sock.close();
};

/**
 * @name Server#message
 * @event
 * @param {Client} client  Client instance with all the information you need.
 *
 * @description Server calls this event on new messages. You can hook to it like this:
 * @example
 * // Include cbNetwork - this is to be changed to require('cbNetwork');
 * var cbNetwork = require('../src/cbNetwork');
 *
 * // Create a new server at port 1337
 * var server = cbNetwork.Server(1337);
 *
 * server.on('message', function (client) {
 *   client.reply(client.data);  // Simple echo server example
 * }
 */

exports.Server = Server;
