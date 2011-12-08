var cbNetwork = require('../src/cbNetwork');
var udp = require('dgram');

// Hoist up a server
var server = new cbNetwork.Server.createServer(1337);

// Reply on message.
server.on('message', function (data, client) {
  server.send(data, client);
});

// Create a simple client to test the server
var sock = new udp.createSocket('udp4');

// Send a message to our EchoServer
console.log('Sending Hello World!');
var msg = new Buffer('Hello World!');
sock.send(msg, 0, msg.length, 1337, '127.0.0.1');

// Wait for server's reply
sock.on('message', function (msg, peer) {
  console.log('Server Replied: ' + msg.toString());
  // We're done!
  sock.close();
  server.sock.close();
});

/* Expected result:

>node EchoServer.js

Sending Hello World!
Server Replied: Hello World!
UDP CLOSED <-- ignore these, they will be gone. :D
undefined
*/