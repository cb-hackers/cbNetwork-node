var cbNetwork = require('../src/cbNetwork');

cbNetwork.HTTP.get('http://tuhoojabotti.com/r', function (status, data) {
  console.log('Server responded: ' + status);
  console.log('Data: ' + data);
});

/* Expected result something like this:

>node "HTTP.get test.js"
Server responded: 301
Data: <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>301 Moved Permanently</title>
</head><body>
<h1>Moved Permanently</h1>
<p>The document has moved <a href="http://tuhoojabotti.com/r/">here</a>.</p>
<hr>
<address>Apache/2.2 Server at tuhoojabotti.com Port 80</address>
</body></html>
*/