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
  this.sock = dgram.createSocket('udp4', function (msg, peer) {
    var data = new Net(new Buffer(msg)); // Get a REAL Buffer from the ugly SlowBuffer :S
    self.emit('message', data, peer);
  });
  this.sock.bind(port);
}

cbServer.prototype.__proto__ = EventEmitter.prototype;

cbServer.prototype.send = function (data) {
  if (!data instanceof Net) {throw Error('Data must be a Net object.');}
  console.log('Sending: ');
  console.log(data.memBlock);
  this.sock.send(data.memBlock);
};

exports.createServer = cbServer;
