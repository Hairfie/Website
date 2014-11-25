require('node-jsx').install({extension:'.jsx'});

var express         = require('express');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var url             = require('url');
var proxy           = require('proxy-middleware');
var swig            = require('swig');
var filters         = require('./lib/helpers/filters');
var config          = require('./config/config');
var debug           = require('debug')('Server');
var server          = express();

// i18n - Translations
var i18n            = require('i18n');
i18n.configure({
    locales:['en', 'fr'],
    defaultLocale: 'en',
    directory: __dirname + '/locales',
    extension: '.js'
});
server.use(i18n.init);

// view engine setup
server.engine('.html.swig', swig.renderFile);
server.set('view engine', '.html.swig');
server.set('views', path.join(__dirname, 'views'));
swig.setDefaults({ cache: false });
server.set('view cache', !config.debug);

server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// TODO: remove me as soon as v1.1.0 of the iOS app is dead
server.use('/api', proxy(url.parse('http://hairfie.herokuapp.com/api')));
server.use(express.static(path.join(__dirname, 'public')));

// serve application
server.use(function (req, res, next) {
    var app              = require('./client/app');
    var context          = app.createContext();
    var initialize       = require('./client/actions/initialize');
    var payload          = {request: req};
    var ApplicationStore = require('./client/stores/ApplicationStore');
    var React            = require('react');

    context.executeAction(initialize, payload, function (error) {
        if (error) return next(error);

        try {
            var currentRoute = context.getActionContext().getStore(ApplicationStore).getCurrentRoute();
            if (currentRoute && currentRoute.path != req.path) {
                res.redirect(currentRoute.path);
                return;
            }

            var appHtml = React.renderToString(app.getAppComponent()({
                context: context.getComponentContext()
            }));
            var appState = app.dehydrate(context);

            res.render('index', {
                appHtml : appHtml,
                appState: appState
            });
        } catch (e) {
            next(e);
        }
    });
});

// error handlers
server.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: config.debug ? err: {}
    });
});

module.exports = server;

if (require.main === module) {
    server.set('port', process.env.PORT || 3001);
    server.listen(server.get('port'), function () {
        debug('listening on port ' + server.get('port'));
    });
}
