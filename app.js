var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
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

// Meta

app.use(function(req, res, next){
    res.locals.metas = [ { property: 'fb:app_id', content: '1567052370184577' },
  { property: 'og:type', content: 'hairfie-dev:hairfie' },
  { property: 'og:url',
    content: 'http://localhost:3000/hairfie/546381bb8adfa3184915c2c1' },
  { property: 'og:title',
    content: 'Hairfie posted by Antoine H.' },
  { property: 'og:image',
    content: 'http://localhost:3000/api/containers/hairfies/download/abfa31855ce09c1df545836afa13ff51.jpg' },
  { property: 'hairfie:author',
    content: 'http://localhost:3000/user/5423e9e85bc01ec8742be1a4' },
  { property: 'hairfie:business',
    content: 'http://localhost:3000/business/54339d860cfcdf7a2dc53b4d/hair-ault' } ];
    next();
});

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
