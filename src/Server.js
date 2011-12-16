/**
 * Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 *
 * @requires dgram, Packet
 */

/** @ignore */
var dgram = require('dgram'), 
  EventEmitter = process.EventEmitter,
  Packet = require('./Packet').Packet;

/** 
 * Client class includes client information, message and a reply function for convenience
 *
 * @constructor
 * @param {String} address    Client's address
 * @param {Number} port       Client's port
 * @param {Number} id         Client's unique identifier
 * @param {Packet} data       Client's message to the server
 * @param {UDP Socket} sock   Reference to server's UDP socket (used for answering to the client)
 */
function Client(address, port, id, data, sock) {
  this.address = address;
  this.port = port;
  this.id = id;
  this.data = data;
  this.sock = sock;
}

/** 
 * Reply function replies to the client and automagically assigns correct client ID for the packet.
 *
 * @param {Packet} data  Data to send to client
 */
Client.prototype.reply = function (data) {
  if (!data instanceof Packet) {throw Error('Data must be a Packet object.');}
  data.clientId = this.id;
  this.sock.send(data.memBlock, 0, data.memBlock.length, this.port, this.address, function (err) {
    if (err) {console.log(err);}
  });
};

/**
 * Server is the heart of cbNetwork-node. It creates an UDP socket and listens to it.
 * Automatically handling all client connections and calling 'message' event on new messages
 *
 * @constructor
 * @param {Number} port       Port to bind to.
 * @param {String} [address]  Address to attach to.
 */
function Server(port, address) {
  var self = this;
  this.clients = {};
  this.clientCount = 0;
  this.sock = dgram.createSocket('udp4');
  this.sock.on('message', function (msg, peer) {
    var data = new Packet(new Buffer(msg)); // Get a REAL Buffer from the ugly SlowBuffer :S
    var client;
    if( data.clientId === 0 ) {
      // Create a new client
      client = new Client(peer.address, peer.port, self.clientCount + 1, data, self.sock);
      self.clients[++self.clientCount] = client;
    } else { // Already exists! Update port and data
      client = self.clients[data.clientId];
      client.port = peer.port;
      client.data = data;
    }
    // Tell the server that we have a new message!
    self.emit('message', client);
  });
  
  // Handle errors! Neat!
  this.sock.on('error', function (e) {
    console.log('UDP ERROR');
    console.log(e);
    self.sock.close();
  });
  // Handle errors! Neat!
  this.sock.on('close', function (e) {
    console.log('UDP CLOSED');
    console.log(e);
  });
  
  // Bind the server
  this.sock.bind(port, address);
  console.log("Server listening on " + address + ":" + port);
}

Server.prototype.__proto__ = EventEmitter.prototype;

/** 
 * Server calls this event on new messages. You can hook to it like this:
 *
 * @example 
 * Server.on('message', function (client) { 
 *   // simple echo server example
 *   client.reply(client.data);
 * }
 *
 * @name Server#message
 * @event
 * @param {Client} client  Client instance with all the information you need.
 */

exports.initServer = Server;
