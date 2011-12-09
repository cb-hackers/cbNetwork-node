// Requires cbNetwork and node-optimist: https://github.com/substack/node-optimist
var cbNetwork = require('../../src/cbNetwork');
var Net = cbNetwork.MemBlock.Net;
var argv = require('optimist')
    .default({p : 1337, a : undefined})
    .alias({'p' : 'port', 'a' : 'alias'})
    .argv;

var clients = [];
var messages = [];

// Default configs
var config = {
  port: 1337
};
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
var server = new cbNetwork.Server.createServer(argv.p, argv.a);


// Handle messages from clients
server.on('message', function (data, client) {
  console.log('________________________________________________________________________________');
  console.log(client.id);
  // Packet based on the first byte
  var netMsg = data.byte;
  switch (netMsg) {
    case NET.LOGIN:
      var name = data.string;
      if (name.trim() === '') {
        console.log('Login failed! Nickname is invalid.');
        var reply = new Net(2);
        reply.id = data.id;
        reply.byte = NET.LOGIN_FAILED;
        reply.byte = NET.END;
        server.send(reply, client);
        return;
      }
      // Nice a new chatter! Let's add him/her to the client list
      console.log(name + ' just entered the chat!');
      createClient(client.id, name);
      // Let's send a packet telling everything went better than expected.png
      var reply = new Net();
      reply.id = data.id;
      reply.byte = NET.LOGIN_OK;
      
      // Also send all client's info
      for (var i = 0; i < clients.length; i++) {
        reply.byte = NET.CLIENT_INFO;
        reply.string = clients[i].id;
        reply.string = clients[i].nick;
      }
      // Aand it's gone!
      reply.byte = NET.END;
      server.send(reply, client);
      break;
    case NET.LOGOUT:
      deleteClient(client.id);
      return;
    /* 
    default:
      console.log('UNIMPLEMENTED');
      console.log(data.memBlock);
    */
  }
  
  // Update the sender's timestamp
  for (var i = 0; i < clients.length; i++) {
    if (client.id !== clients[i].id) {
      clients[i].lastActivity = new Date().getTime();
    }
  }
  
  // Check rest of the messages
  while (netMsg) {
    switch (netMsg) {
      case NET.TEXT_MESSAGE:
        sendText(data.string, client.id);
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
    netMsg = data.byte;
  }
  
  // Then send all messages that belong to this client
  var reply = new Net();
  reply.id = data.id;
  for (var i = 0; i < messages.length; i++) {
    if (messages[i].ID === client.id) {
      // Set the type of the message
      reply.byte = messages[i].msgType;
      // Set sender ID of the message
      reply.string = messages[i].senderID;
      switch (messages[i].msgType) {
        case NET.LOGIN:
          // Who logged in?
          reply.string = messages[i].message;
          break;
        case NET.TEXT_MESSAGE:
          // What was said?
          reply.string = messages[i].message;
          break;
      }

      // Delete the message
      messages.splice(i, 1);
    }
  }
  reply.byte = NET.END;
  server.send(reply, client);
  
});

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
        if (clientID !== clients[i].id) {
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