/**
 * @namespace Core of the library, includes {UDP} Server, Packet and HTTP modules
 *            binding them into one module to be required in your project.
 */
var cbNetwork = {
  HTTP: require('./HTTP'),
  Server: require('./Server').Server,
  Packet: require('./Packet').Packet
};

exports.HTTP = cbNetwork.HTTP;
exports.Server = cbNetwork.Server;
exports.Packet = cbNetwork.Packet;