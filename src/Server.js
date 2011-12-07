/**
 * Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 *
 * @requires dgram, events, Net
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

var dgram = require('dgram'), 
  EventEmitter = process.EventEmitter,
  Net = require('./MemBlock').Net;

function cbServer(port) {
  var self = this;
  this.connections = [];
  this.sock = dgram.createSocket('udp4', function (msg, peer) {
    peer.id = peer.address + ':' + peer.port;
    var data = new Net(new Buffer(msg)); // Get a REAL Buffer from the ugly SlowBuffer :S
    self.emit('message', data, peer);
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
  this.sock.bind(port);
}

cbServer.prototype.__proto__ = EventEmitter.prototype;

cbServer.prototype.send = function (data, client) {
  if (!data instanceof Net) {throw Error('Data must be a Net object.');}
  this.sock.send(data.memBlock, 0, data.memBlock.length, client.port, client.address, function (err, bytes) {
    if (err) {console.log(err);}
  });
};

exports.createServer = cbServer;
