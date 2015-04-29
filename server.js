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
var ServerActions    = require('./actions/Server');
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

function bestLocale(req) {
    return req.acceptsLanguages(i18nConfig.SUPPORTED_LOCALES) || i18nConfig.DEFAULT_LOCALE;
}

function redirectToLocalized(req, res, next) {
    res.redirect(302, '/'+bestLocale(req)+req.url);
}

server.get('/', redirectToLocalized);
server.get('/hairfies/:hairfieId', redirectToLocalized);
server.get('/businesses/:businessId', redirectToLocalized);
server.get('/businesses/:businessId/:slug', redirectToLocalized);
server.get('/reset-password/:userId/:token', redirectToLocalized);
server.get('/write-business-review/:businessReviewRequestId', redirectToLocalized);


// serve application
server.use(function (req, res, next) {
    var context = app.createContext({
        req: req,
        res: res
    });
    var payload = {request: req};

    context.executeAction(ServerActions.Initialize, payload, function (error) {
        if (error && -1 === ([301, 302]).indexOf(error.status)) return next(error);

        try {
            if (error) {
                res.redirect(error.location, error.status);
                return;
            }

            var currentRoute = context.getActionContext().getStore(RouteStore).getCurrentRoute();

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

            if (!currentRoute) res.status(404);

            res.write(html);
            res.end();
        } catch (e) {
            next(e);
        }
    });
});

// error handlers
server.use(function (err, req, res, next) {
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
