var cbNetwork = require('cbNetwork');
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
});
