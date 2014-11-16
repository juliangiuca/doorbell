require('newrelic');
var accountSid = process.env.TWILIO_SID;
var authToken = process.env.TWILIO_AUTH;
var client = require('twilio')(accountSid, authToken);
var express = require('express');
var app = express();
var fs = require('fs');

var callInEveryone = function() {
  var toCall = [process.env.JULIAN_PH, process.env.LIZ_PH];

  toCall.forEach(function (number) {
    var options = {
      from: process.env.TWILIO_NO,
      to: number,
      url: 'http://door.innocuous.me/conference',
      IfMachine: 'Hangup'
    };

    client.calls.create(options,
    function(err, call) {
      if (err) { console.log(err); }

      if (call) {
        console.log('SID: ', call.sid);
      }
    });

  })
}

app.set('port', (process.env.PORT || 5000));

app.get('/', function (req, res) {
  res.send('Hello World!');
})

app.get('/status', function (req, res) {
  res.send('Hello World!');
})

app.get('/doorbell', function (req, res) {
  console.log("Query params: ", req.query);

  callInEveryone();

  fs.readFile('views/conference.xml', function (err, data) {
    if (err) { console.log(err); }

    res.set('Content-Type', 'text/xml');
    res.send(data);
  })
})

app.post('/conference', function (req, res) {

  fs.readFile('views/conferenceWithHangup.xml', function (err, data) {
    if (err) { console.log(err); }

    res.set('Content-Type', 'text/xml');
    res.send(data);
  })
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
})
