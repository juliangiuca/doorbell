require('newrelic');
var accountSid = process.env.TWILIO_SID;
var authToken  = process.env.TWILIO_AUTH;
var client     = require('twilio')(accountSid, authToken);
var express    = require('express');
var app        = express();
var fs         = require('fs');
var http       = require('http');

var interval = setInterval(function() { http.get(process.env.TARGET_URL + '/status'); }, 60000);

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/status', function (req, res) {
  console.log("Status!");
  res.send('Hello World!');
})

app.get('/doorbell', function (req, res) {
  if (!req.query || !req.query.From) { 
    return res.send("Oh hi there");
  }

  console.log("Receiving a call from ", req.query.From);

  fs.readFile('views/roundRobin.xml', {encoding: 'utf8'}, function (err, data) {
    if (err) { console.log(err); }

    var parsedXml = data.replace(/Julian/, process.env.JULIAN_PH);
    parsedXml = parsedXml.replace(/Liz/, process.env.LIZ_PH);

    res.set('Content-Type', 'text/xml');
    res.send(parsedXml);
  });

});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
})
