var cbNetwork = require('../src/cbNetwork');
var Packet = cbNetwork.Packet;
var argv = require('optimist')
    .default({p : 1337, a : undefined})
    .alias({'p' : 'port', 'a' : 'address', 'd' : 'debug'})
    .argv;

// Create a server on a port specified in command line or if not specified, use the default 1337
var server = new cbNetwork.Server(argv.p, argv.a);

// Reply on message.
server.on('message', function (client) {
  client.reply(client.data);
  console.log(client.data);
});

/*
// Create a simple client to test the server
var sock = new udp.createSocket('udp4');


// Send a message to our EchoServer
console.log('Sending Hello World!');
var msg = new Buffer('Hello World!');
sock.send(msg, 0, msg.length, argv.p, argv.a);

// Wait for server's reply
sock.on('message', function (msg, peer) {
  console.log('Server Replied: ' + msg.toString());
  // We're done!
  sock.close();
  server.sock.close();
});
*/

/* Expected result:

>node EchoServer.js

Sending Hello World!
Server Replied: Hello World!
UDP CLOSED <-- ignore these, they will be gone. :D
undefined
*/