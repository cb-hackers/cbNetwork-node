/**
 * Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 *
 * @requires dgram, events, Net
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

var dgram = require('dgram'), 
  EventEmitter = process.EventEmitter,
  Net = require('./MemBlock').Net;

// Ugly, but hopefully works. TODO: Create a class for cbServer
var cbServerClientCounter = 0;

function cbServer(port, address) {
  var self = this;
  this.sock = dgram.createSocket('udp4');
  this.sock.on('message', function (msg, peer) {
    var data = new Net(new Buffer(msg)); // Get a REAL Buffer from the ugly SlowBuffer :S
    if( data.id === 0 ) {
      console.log('Truly a new client');
      data.id = ++cbServerClientCounter;
    }
    peer.id = peer.address + ':' + data.id;
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
  this.sock.bind(port, address);
  
  var addr = this.sock.address();
  console.log("cbServer listening on " + addr.address + ":" + addr.port);
}

cbServer.prototype.__proto__ = EventEmitter.prototype;

cbServer.prototype.send = function (data, client) {
  if (!data instanceof Net) {throw Error('Data must be a Net object.');}
  this.sock.send(data.memBlock, 0, data.memBlock.length, client.port, client.address, function (err, bytes) {
    if (err) {console.log(err);}
  });
};

exports.createServer = cbServer;
