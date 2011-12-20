// Requires cbNetwork and node-optimist: https://github.com/substack/node-optimist
var cbNetwork = require('cbNetwork');
var Packet = cbNetwork.Packet;
var argv = require('optimist')
    .default({p : 1337, a : undefined})
    .alias({'p' : 'port', 'a' : 'address', 'd' : 'debug'})
    .argv;

var clients = [];
var messages = [];

// Some constants
var NET = {
  LOGIN: 1,
  LOGOUT: 2,
  LOGIN_OK: 3,
  LOGIN_FAILED: 4,
  CLIENT_INFO: 5,
  TEXT_MESSAGE: 6,
  IDLE: 7,
  END: 255
};

// Create a server on a port specified in command line or if not specified, use the default 1337
var server = new cbNetwork.Server(argv.p, argv.a);


// Handle messages from clients
server.on('message', function (client) {
  var data = client.data;
  // Packet based on the first byte
  var netMsg = data.getByte();
  switch (netMsg) {
    case NET.LOGIN:
      var name = data.getString();
      if (name.trim() === '') {
        console.log(client.id + ': Login failed! Nickname is invalid.');
        var reply = new Packet(2);
        reply.putByte(NET.LOGIN_FAILED);
        reply.putByte(NET.END);
        client.reply(reply);
        return;
      }
      // Nice a new chatter! Let's add him/her to the client list
      console.log(name + ' <' + client.id + '> just entered the chat!');
      createClient(client.id, name);
      // Let's send a packet telling everything went better than expected.png
      var reply = new Packet();
      reply.putByte(NET.LOGIN_OK);

      // Also send all client's info
      for (var i = 0; i < clients.length; i++) {
        reply.putByte(NET.CLIENT_INFO);
        reply.putString('' + clients[i].id);
        reply.putString(clients[i].nick);
      }
      // Aand it's gone!
      reply.putByte(NET.END);
      client.reply(reply);
      return;
    case NET.LOGOUT:
      console.log(client.id + ' logged out.');
      deleteClient(client.id);
      return;
  }

  // Update the sender's timestamp
  for (var i = 0; i < clients.length; i++) {
    if (client.id === clients[i].id) {
      clients[i].lastActivity = new Date().getTime();
    }
  }

  // Check rest of the messages
  while (netMsg) {
    switch (netMsg) {
      case NET.TEXT_MESSAGE:
        sendText(data.getString(), client.id);
        break;
      case NET.END:
        // OK!
        break;
      case NET.IDLE:
        // Well thanks for the info!
        break;
      default:
        console.log('UNKOWN MESSAGE');
        console.log('Message-ID: ' + netMsg);
    }
    // Read next message's type
    netMsg = data.getByte();
  }

  // Then send all messages that belong to this client
  var reply = new Packet();
  for (var i = 0; i < messages.length; i++) {
    if (messages[i].ID === client.id) {
      // Set the type of the message
      reply.putByte(messages[i].msgType);
      // Set sender ID of the message
      reply.putString('' + messages[i].senderID);

      if (messages[i].msgType === NET.LOGIN ||
          messages[i].msgType === NET.TEXT_MESSAGE) {
        reply.putString(messages[i].message);
      }

      // Delete the message
      messages.splice(i, 1);
    }
  }
  reply.putByte(NET.END);
  client.reply(reply);

});

// Check for timeouts
setInterval(function () {
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].lastActivity + 5000 < new Date().getTime()) {
      console.log('Timeout ' + clients[i].id);
      deleteClient(clients[i].id);
    }
  }
}, 3000);

function createClient(clientID, name) {
  // Create new messages to the queue for all clients
  for (var i = 0; i < clients.length; i++) {
    messages.push({
      ID: clients[i].id,  // To whom?
      msgType: NET.LOGIN, // Wut?
      message: name,      // Contents..
      senderID: clientID  // Who would do that?
    });
  }
  // Check if client already existed
  for (var i = 0; i < clients.length; i++) {
    if (clients[i].id === clientID) {
      clients[i].nick = name;
      clients[i].lastActivity = new Date().getTime();
      return;
    }
  }

  // Create a new client too
  clients.push({
    id: clientID,
    nick: name,
    lastActivity: new Date().getTime()
  });
}

function deleteClient(clientID) {
  for (var i = 0; i < clients.length; i++) {
    if (clientID === clients[i].id) {
      for (var j = 0; j < clients.length; j++) {
        if (clientID !== clients[j].id) {
          messages.push({
            ID: clients[j].id,    // To whom?
            msgType: NET.LOGOUT,  // The what?
            senderID: clientID    // From who?
          });
        }
      }
      // Delete messages to the dude leaving
      for (var j = 0; j < messages.length; j++) {
        if (messages[j].ID === clientID) {
          messages.splice(j, 1);
        }
      }
      // Also delete the client
      clients.splice(i, 1);
      return;
    }
  }
}

function sendText(text, clientID, toClient) {
  console.log('<' + clientID + '> ' + text);
  // Create new messages to the queue for all clients
  for (var i = 0; i < clients.length; i++) {
    if (!toClient || toClient === clients[i].id) {
      messages.push({
        ID: clients[i].id,          // To whom?
        msgType: NET.TEXT_MESSAGE,  // Wut?
        message: text,              // Contents..
        senderID: clientID          // Who would send that?
      });
    }
  }
}