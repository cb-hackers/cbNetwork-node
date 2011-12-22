/**
 * @fileOverview This file has the implementation of {@link Server} and {@link Client} classes.
 */

/** @ignore */
var dgram = require('dgram')
  , EventEmitter = process.EventEmitter
  , Packet = require('./Packet')
  , colors = require('colors')
  , log = new (require('./Logger'))('[cbNetwork %t] '.cyan);

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
 * @property {String} id       Client's unique identifier, cbNetwork style
 * @property {Number} uid      Client's numeral id 1...2^32
 * @property {Packet} data     Client's message to the server
 * @property {UDP} _sock       Reference to server's UDP socket (used for answering to the client)
 */
function Client(address, port, id, data, sock) {
  this.address = address;
  this.port = port;
  this.uid = id;
  this.id = address + ':' + id;
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
  data.clientId = this.uid;
  this._sock.send(data.memBlock, 0, data.memBlock.length, this.port, this.address, function (err) {
    if (err) {
      log.error('Unable to send data to client'.red);
      console.dir(err);
    }
  });
};

/**
 * Creates a new server.
 *
 * @class Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 * @requires dgram, colors, {@link Packet}
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
    // log.write('New packet!'.rainbow); // Awesome!
    var data = new Packet(new Buffer(msg)), client;
    if( data.clientId === 0 ) {
      log.info('New client connected %0 (%1)', peer.address.magenta, String(self._clientCount + 1).magenta);
      // Create a new client
      client = new Client(peer.address, peer.port, self._clientCount + 1, data, self._sock);
      self._clients[++self._clientCount] = client;
    } else {
      // Already exists! Update port and data
      client = self._clients[data.clientId];
      if (!client || client.address !== peer.address) {
        log.notice('Assigning %0 a new ID (%1)', peer.address.magenta, String(self._clientCount + 1).magenta);
        client = new Client(peer.address, peer.port, self._clientCount + 1, data, self._sock);
        self._clients[++self._clientCount] = client;
      }
      client.port = peer.port;
      client.data = data;
    }
    // Tell the server that we have a new message!
    self.emit('message', client);
  });

  // Handle errors. Neat!
  this._sock.on('error', function (e) {
    log.fatal('UDP ERROR');
    console.dir(e);
    self.close(); // Abandon ship!
  });
  this._sock.on('close', function () {
    log.info('Server closed gracefully');
  });

  // Bind the server
  this._sock.bind(port, address);
  log.info("Server listening on " + (address ? address : '0.0.0.0') + ":" + port);
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
 * // Load up cbNetwork
 * var cbNetwork = require('cbNetwork');
 *
 * // Create a new server at port 1337
 * var server = new cbNetwork.Server(1337);
 *
 * server.on('message', function (client) {
 *   client.reply(client.data);  // Simple echo server example
 * });
 */

exports = module.exports = Server;
