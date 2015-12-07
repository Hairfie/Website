require('node-jsx').install({extension:'.jsx'});

if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
        require('newrelic');
    }
    catch (e) {
        console.log('NEWRELIC Error')
        console.log(e)
    }
}

var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var url             = require('url');
var debug           = require('debug')('Server');
var server          = express();
var compress        = require('compression');
var robots          = require('robots.txt');

var sitemap         = require('./sitemap');

var React           = require('react');
var ReactDOMServer  = require('react-dom/server');
var app             = require('./app');
var ServerActions   = require('./actions/ServerActions');
var RouteStore      = require('./stores/RouteStore');
var MetaStore       = require('./stores/MetaStore');
var BusinessStore   = require('./stores/BusinessStore');
var provideContext  = require('fluxible-addons-react/provideContext');

var Html = provideContext(require('./components/Html.jsx'), require('./context'));
var ErrorPage = provideContext(require('./components/ErrorPage.jsx'), require('./context'));


// Gzip compression
server.use(compress());

server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
server.use(cookieParser());

var robotFile = process.env.NODE_ENV === 'production' ? 'robots-production.txt' : 'robots-staging.txt';
server.use(robots(__dirname + '/public/robots/' + robotFile));

server.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});

server.use('/assets', express.static(path.join(__dirname, 'public')));

server.get('/sitemap.xml', function(req, res) {
  res.header('Content-Type', 'application/xml');
  res.send(sitemap.toString());
});


// serve application
server.use(function (req, res, next) {
    var context = app.createContext({
        req: req,
        res: res
    });
    context.executeAction(ServerActions.initialize, req.url)
        .then(function () {
            var AppComponent = app.getComponent();
            var markup = ReactDOMServer.renderToString(React.createFactory(AppComponent)({
                context: context.getComponentContext()
            }));

            var html = '<!doctype html>'+ReactDOMServer.renderToStaticMarkup(React.createFactory(Html)({
                context : context.getComponentContext(),
                state   : app.dehydrate(context),
                markup  : markup
            }));

            // res.write(html);
            // res.end();
            res.send(html);
        })
        .catch(function (err) {
            next(err);
        });
});

server.use(function (err, req, res, next) { // try localized page
    if('/assets/' !== req.url.substr(0, 8) && !(req.url.indexOf('sitemap') > -1) && '/fr/' !== req.url.substr(0, 4)) {
        res.redirect(302, '/fr'+req.url);
    } else {
        next(err);
    }
});

server.use(function (err, req, res, next) { // handle redirects
    if (err.location && -1 !== [301, 302].indexOf(err.status || err.statusCode)) {
        res.redirect(err.status || err.statusCode, err.location);
    } else {
        next(err);
    }
});

server.use(function (err, req, res, next) { // error page
    if (404 !== (err.status || err.statusCode)) {
        console.log(err.stack || err);
    }

    var context = app.createContext({
        req: req,
        res: res
    });

    var state = app.dehydrate(context);

    var markup = ReactDOMServer.renderToStaticMarkup(React.createFactory(ErrorPage)({
        context: context.getComponentContext(),
        error  : err
    }));

    var html = '<!doctype html>'+ReactDOMServer.renderToStaticMarkup(React.createFactory(Html)({
        context : context.getComponentContext(),
        state   : state,
        markup  : markup
    }));

    res.status(err.status || err.statusCode || 500);
    res.write(html);
    res.end();
});

module.exports = server;

if (require.main === module) {
    server.set('port', process.env.PORT || 3001);
    server.listen(server.get('port'), function () {
        debug('listening on port ' + server.get('port'));
    });
}