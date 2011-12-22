/**
 * @fileOverview This file has the implementation of {@link cbNetwork} namespace.
 */

/**
 * @namespace Core of the library, includes {@link Server}, {@link Packet} and {@link HTTP} modules
 *            binding them into one module to be required in your project.
 */
var cbNetwork = {
  /** The {@link HTTP} module */
  HTTP: require('./HTTP'),
  /** The {@link Server} module */
  Server: require('./Server'),
  /** The {@link Packet} module */
  Packet: require('./Packet'),
  /** The {@link Logger} module */
  Logger: require('./Logger')
};

exports = module.exports = cbNetwork;
/*
exports.HTTP = cbNetwork.HTTP;
exports.Server = cbNetwork.Server;
exports.Packet = cbNetwork.Packet;
*/