A Node.js implementation of cbNetwork
=====================================
Philosophy
----------
You might think we are crazy, but I think this is a nice project to learn how to use Node and perhaps encourages CoolBasic people to venture out.

We try to keep the API similar to the original cbNetwork's, but because of the asynchronous nature of Node we must do things little differently.
For example we don't do ```ServerRead()```, but we listen on new messages like this: ```server.on('message', function (data, client) { /* Let's get this done with */ });```
And we don't have globals like ```_Net_GetByte()```, we use the data parameter from the message event: ```data.getByte();``` For more see the documentation (once we make one)!

Coding conventions
------------------
* No tabs; use 2 spaces instead.
* Variables and functions use camelCaps, so the first letter is lowercase and
  the following words have their first letter in uppercase.
* Classes names start with a capital letter and so follow CamelCaps rules.
* Constants are written in uppercase and words are delimited with underscores "_".
* Column limit is 100, but it is not enforced - so no stupid midstatement newlines!
* Document your functions, classes, methods and complex structures with jsdoc-toolkit
  - see [here](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference) for a reference of tags

cbNetwork internal data schema
------------------------------
1. Client connects to server
   * first 4 bytes: 00 00 00 00
2. Server responds
   * Server generates a client id (for example, 01 00 00 00)
   * first 4 bytes: client id
3. Client is connected and sends more data
   * first 4 bytes: client id received from server (for example, 01 00 00 00)
4. Server responds
   * first 4 bytes: client id, already generated
5. Client sends data:
   * first 4 bytes: the same client id
6. and so on and so forth.
