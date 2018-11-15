require('newrelic');

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  bodyParser = require('body-parser');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.disable('etag');

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, x-access-token');

  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  }
  else {
    next();
  }
});

var fileUploadRoutes = require('./api/routes/fileUploadRoutes');
fileUploadRoutes(app);

var eventRoutes = require('./api/routes/competitionRoutes');
eventRoutes(app);

var authRoutes = require('./api/routes/authenticationRouter');
authRoutes(app);

var videoRoutes = require('./api/routes/videoRoutes');
videoRoutes(app);

app.use(function (req, res) {
  res.status(404).send('Not found');
});

app.listen(port);

console.log('Events RESTful API server started on: ' + port);
