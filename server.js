require('node-jsx').install({extension:'.jsx'});

if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}

var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var url             = require('url');
var config          = require('./configs/server');
var i18nConfig      = require('./configs/i18n');
var debug           = require('debug')('Server');
var server          = express();
var expressState    = require('express-state');
var compress        = require('compression');
var robots          = require('robots.txt')

var React            = require('react');
var app              = require('./app');
var ServerActions    = require('./actions/ServerActions');
var RouteStore       = require('./stores/RouteStore');
var MetaStore        = require('./stores/MetaStore');
var BusinessStore    = require('./stores/BusinessStore');
var HtmlComponent    = require('./components/Html.jsx');
var ErrorPage        = require('./components/ErrorPage.jsx');

expressState.extend(server);

// Gzip compression
server.use(compress());

server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
server.use(cookieParser());
server.use(robots(__dirname + '/public/robots/' + config.ROBOTS));

server.all('*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "X-Requested-With");
   next();
});

server.use(express.static(path.join(__dirname, 'public')));

server.set('state namespace', 'App');

// serve application
server.use(function (req, res, next) {
    var context = app.createContext({
        req: req,
        res: res
    });

    context.executeAction(ServerActions.initialize, req.url)
        .then(function () {
            if (!context.getActionContext().getStore(RouteStore).getCurrentRoute()) {
                var error = new Error('Not found');
                error.status = 404;
                throw error;
            }
        })
        .then(function () {
            var metas = context.getActionContext().getStore(MetaStore).getMetas();
            var title = context.getActionContext().getStore(MetaStore).getTitle();

            var appState = app.dehydrate(context);
            var AppComponent = app.getComponent();

            res.expose(appState, 'App');

            var markup = React.renderToString(React.createFactory(AppComponent)({
                context: context.getComponentContext()
            }));

            var html = '<!doctype html>'+React.renderToStaticMarkup(React.createFactory(HtmlComponent)({
                state   : res.locals.state,
                title   : title,
                metas   : metas,
                markup  : markup
            }));

            res.write(html);
            res.end();
        })
        .catch(function (err) {
            next(err);
        });
});

server.use(function (err, req, res, next) { // try localized page
    if ('/fr/' !== req.url.substr(0, 4)) {
        res.redirect(302, '/fr'+req.url);
    }
});

server.use(function (err, req, res, next) { // handle redirects
    if (err.location && -1 !== [301, 302].indexOf(err.status)) {
        res.redirect(err.status, err.location);
    } else {
        next(err);
    }
});

server.use(function (err, req, res, next) { // error page
    var html = '<!doctype html>'+React.renderToStaticMarkup(React.createFactory(ErrorPage)({
        error: err,
        debug: !!config.DEBUG
    }));

    res.status(err.status || 500);
    res.write(html);
    res.end();
});

module.exports = server;

if (require.main === module) {
    server.set('port', config.PORT);
    server.listen(server.get('port'), function () {
        debug('listening on port ' + server.get('port'));
    });
}
