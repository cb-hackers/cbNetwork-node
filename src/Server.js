/**
 * Server is an UDP server using Node's UDP API that works like the cbNetwork server.
 *
 * @requires dgram, Packet
 * @author Ville "tuhoojabotti" Lahdenvuo
 */

var dgram = require('dgram'), 
  EventEmitter = process.EventEmitter,
  Packet = require('./Packet').Packet;

function Server(port, address) {
  var self = this;
  this.clientCount = 0;
  this.sock = dgram.createSocket('udp4');
  this.sock.on('message', function (msg, peer) {
    var data = new Packet(new Buffer(msg)); // Get a REAL Buffer from the ugly SlowBuffer :S
    if( data.id === 0 ) {
      console.log('A new client!');
      // ID cbNetwork style
      
      data.sender = {
        id: peer.address + ':' + (++self.clientCount),
        address: peer.address,
        port: peer.port
      };
    }
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
  
  //var addr = this.sock.address();
  //console.log("Server listening on " + addr.address + ":" + addr.port);
}

Server.prototype.__proto__ = EventEmitter.prototype;

Server.prototype.send = function (data) {
  if (!data instanceof Packet) {throw Error('Data must be a Packet object.');}
  this.sock.send(data.memBlock, 0, data.memBlock.length, data.sender.port, data.sender.address, function (err, bytes) {
    if (err) {console.log(err);}
  });
};

exports.initServer = Server;
