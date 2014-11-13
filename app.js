var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var url             = require('url');
var proxy           = require('proxy-middleware');
var swig            = require('swig');
var config          = require('./config/config');

var routes          = require('./routes/index');
var businesses      = require('./routes/businesses');
var hairfies        = require('./routes/hairfies');

var app             = express();

// view engine setup
app.engine('.html.swig', swig.renderFile);
app.set('view engine', '.html.swig');
app.set('views', path.join(__dirname, 'views'));

swig.setDefaults({ cache: false });

if (app.get('env') === 'development' || app.get('env') === 'staging') {
    app.set('view cache', false);
} else {
    app.set('view cache', true);
}

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api', proxy(url.parse('http://hairfie.herokuapp.com/api')));

app.use('/', routes);
app.use('/businesses', businesses);
app.use('/hairfies', hairfies);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
