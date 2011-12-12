/**
 * Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 *
 * @requires dgram, Packet
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

var dgram = require('dgram'), 
  EventEmitter = process.EventEmitter,
  Packet = require('./Packet').Packet;

function Client(address, port, id, sock) {
  this.address = address;
  this.port = port;
  this.id = id;
  this.data;
  this.sock = sock;
}

Client.prototype.reply = function (data) {
  if (!data instanceof Packet) {throw Error('Data must be a Packet object.');}
  data.clientId = this.id;
  this.sock.send(data.memBlock, 0, data.memBlock.length, this.port, this.address, function (err) {
    if (err) {console.log(err);}
  });
};

function Server(port, address) {
  var self = this;
  this.clients = [];
  this.sock = dgram.createSocket('udp4');
  this.sock.on('message', function (msg, peer) {
    var data = new Packet(new Buffer(msg)); // Get a REAL Buffer from the ugly SlowBuffer :S
    var client;
    if( data.clientId === 0 ) {
      client = new Client(peer.address, peer.port, self.clients.length + 1, self.sock);
      client.data = data;
      self.clients.push(client);
    } else {
      client = self.getClient(data.clientId);
      client.port = peer.port;
      client.data = data;
    }
    self.emit('message', client);
  });
  this.sock.on('error', function (e) {
    console.log('UDP ERROR');
    console.log(e);
    self.sock.close();
  });
  this.sock.on('close', function (e) {
    console.log('UDP CLOSED');
    console.log(e);
  });
  this.sock.bind(port, address);

  console.log("Server listening on " + address + ":" + port);
}

Server.prototype.__proto__ = EventEmitter.prototype;

Server.prototype.send = function (data, address, port) {
  if (!data instanceof Packet) {throw Error('Data must be a Packet object.');}
  this.sock.send(data.memBlock, 0, data.memBlock.length, port, address, function (err) {
    if (err) {console.log(err);}
  });
};

Server.prototype.getClient = function (id) {
  for(var i = 0; i < this.clients.length; i++) {
    if (this.clients[i].id === id) {return this.clients[i];}
  }
};

exports.initServer = Server;
