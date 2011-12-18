var cbNetwork = require('../src/cbNetwork');
var Packet = cbNetwork.Packet;
var argv = require('optimist')
    .default({p : 1337, a : undefined})
    .alias({'p' : 'port', 'a' : 'address', 'd' : 'debug'})
    .argv;

// Define some constants that in turn define the upcoming type of data
var NET = {
  BYTE: 1,
  SHORT: 2,
  USHORT: 3,
  INTEGER: 4,
  FLOAT: 5,
  STRING: 6,
  FAIL: 255
};


// Create a server on a port specified in command line or if not specified, use the default 1337
var server = new cbNetwork.Server(argv.p, argv.a);

// Reply on message.
server.on('message', function (client) {
  var data = client.data,
    msgType = data.getByte(),
    reply;
  console.log('Client <' + client.id +'> sent data with type ' + msgType);
  switch( msgType ) {
    case NET.BYTE:
      reply = new Packet(1);
      reply.putByte( data.getByte() );
      break;
    case NET.SHORT:
      reply = new Packet(2);
      reply.putShort( data.getShort() );
      break;
    case NET.USHORT:
      reply = new Packet(2);
      reply.putUShort( data.getUShort() );
      break;
    case NET.INTEGER:
      reply = new Packet(4);
      reply.putInt( data.getInt() );
      break;
    case NET.FLOAT:
      reply = new Packet(4);
      reply.putFloat( data.getFloat() );
      break;
    case NET.STRING:
      reply = new Packet();
      reply.putString( data.getString() );
      break;
    default:
      reply = new Packet(1);
      reply.putByte( NET.FAIL );
  }
  client.reply(reply);
});
