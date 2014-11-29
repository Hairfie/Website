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
var config          = require('./configs/server');
var facebookConfig  = require('./configs/facebook');
var debug           = require('debug')('Server');
var server          = express();
var expressState    = require('express-state');

expressState.extend(server);

// view engine setup
server.engine('.html.swig', swig.renderFile);
server.set('view engine', '.html.swig');
server.set('views', path.join(__dirname, 'views'));
swig.setDefaults({ cache: false });
server.set('view cache', !config.DEBUG);

server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(logger('dev'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: false }));
server.use(cookieParser());

// TODO: remove me as soon as v1.1.0 of the iOS app is dead
server.use(config.API_PROXY_PATH, proxy(url.parse(config.API_PROXY_TARGET)));
server.use(express.static(path.join(__dirname, 'public')));

server.set('state namespace', 'App');

// serve application
server.use(function (req, res, next) {
    var app              = require('./app');
    var context          = app.createContext();
    var ServerActions    = require('./actions/Server');
    var payload          = {request: req};
    var ApplicationStore = require('./stores/ApplicationStore');
    var MetaStore        = require('./stores/MetaStore');
    var React            = require('react');
    var HtmlComponent    = React.createFactory(require('./components/Html.jsx'));

    context.executeAction(ServerActions.Initialize, payload, function (error) {
        if (error) return next(error);

        try {
            var currentRoute = context.getActionContext().getStore(ApplicationStore).getCurrentRoute();
            if (currentRoute && currentRoute.path != req.path) {
                res.redirect(currentRoute.path);
                return;
            }

            var metas = context.getActionContext().getStore(MetaStore).getCurrentMetadata();

            var appState = app.dehydrate(context);
            var AppComponent = app.getAppComponent();

            res.expose(appState, 'App');

            var html = React.renderToStaticMarkup(HtmlComponent({
                state: res.locals.state,
                metas: metas,
                markup: React.renderToString(AppComponent({
                    context: context.getComponentContext()
                }))
            }));

            debug('Sending markup');
            res.write(html);
            res.end();

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
        error: config.DEBUG ? err: {}
    });
});

module.exports = server;

if (require.main === module) {
    server.set('port', config.PORT);
    server.listen(server.get('port'), function () {
        debug('listening on port ' + server.get('port'));
    });
}
