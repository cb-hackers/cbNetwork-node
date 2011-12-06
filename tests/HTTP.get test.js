var cbNetwork = require('../src/cbNetwork');

cbNetwork.HTTP.get('http://tuhoojabotti.com/r/', function (status, data) {
  console.log('Server responded: ' + status);
  console.log('Data: ' + data);
});

/* Expected result something like this:

>node "HTTP.get test.js"
Server responded: 200
Data: <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">
<html>
 <head>
  <title>Index of /r</title>
 </head>
 <body>
<h1>Index of /r</h1>
<table><tr><th><img src="/icons/blank.gif" alt="[ICO]"></th><th><a href="?C=N;O=
D">Name</a></th><th><a href="?C=M;O=A">Last modified</a></th><th><a href="?C=S;O
=A">Size</a></th><th><a href="?C=D;O=A">Description</a></th></tr><tr><th colspan
="5"><hr></th></tr>
<tr><td valign="top"><img src="/icons/back.gif" alt="[DIR]"></td><td><a href="/"
>Parent Directory</a></td><td>&nbsp;</td><td align="right">  - </td><td>&nbsp;</
td></tr>
<tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="
avatars/">avatars/</a></td><td align="right">07-Sep-2010 16:20  </td><td align="
right">  - </td><td>&nbsp;</td></tr>
<tr><td valign="top"><img src="/icons/text.gif" alt="[TXT]"></td><td><a href="ba
nner3.html">banner3.html</a></td><td align="right">29-Sep-2011 14:05  </td><td a
lign="right">597K</td><td>&nbsp;</td></tr>
<tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="
panoramas/">panoramas/</a></td><td align="right">06-Nov-2011 19:15  </td><td ali
gn="right">  - </td><td>&nbsp;</td></tr>
<tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="
prsc/">prsc/</a></td><td align="right">05-Dec-2011 07:44  </td><td align="right"
>  - </td><td>&nbsp;</td></tr>
<tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="
r/">r/</a></td><td align="right">12-Mar-2011 00:14  </td><td align="right">  - <
/td><td>&nbsp;</td></tr>
<tr><td valign="top"><img src="/icons/folder.gif" alt="[DIR]"></td><td><a href="
share/">share/</a></td><td align="right">24-Sep-2011 13:28  </td><td align="righ
t">  - </td><td>&nbsp;</td></tr>
<tr><th colspan="5"><hr></th></tr>
</table>
<address>Apache/2.2 Server at tuhoojabotti.com Port 80</address>
</body></html>
*/