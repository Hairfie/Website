'use strict';

var React = require('react');
var _     = require('lodash');

var oldBrowserHtml = '<!--[if lt IE 9]> \
        <p className="browsehappy"> \
            You are using an <strong>outdated</strong> browser. \
            Please <a href="http://browsehappy.com/">upgrade your browser</a> \
            to improve your experience. \
        </p> \
    <![endif]-->';

var Html = React.createClass({
    render: function() {
        var title = this.props.context.getStore('MetaStore').getTitle();
        var metas = this.props.context.getStore('MetaStore').getMetas();

        return (
            <html className="no-js">
            <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# hairfie: http://ogp.me/ns/fb/hairfie#">
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                {metas.map(function(metaObj) {
                    return <meta property={metaObj.property} content={metaObj.content} />;
                })}
                <meta name="p:domain_verify" content="7da9f1142d3698eff48e81bdc3e77ad6" />
                <link rel="publisher" href="https://plus.google.com/+Hairfie" />
                <link rel="stylesheet" href="/css/style.css" />
                <script src={this.getAssetSrc("/components/modernizr/modernizr.js")}></script>
                <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css' />
                <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
                <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />
                <link href="/components/blueimp-gallery/css/blueimp-gallery.min.css" rel="stylesheet" type="text/css" />
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}} />
                <div className="oldBrowser" dangerouslySetInnerHTML={{__html: oldBrowserHtml}} />

                <script src={this.getAssetSrc("/components/jquery/dist/jquery.min.js")}></script>
                <script src={this.getAssetSrc("/components/typeahead.js/dist/typeahead.jquery.min.js")}></script>
                <script src={this.getAssetSrc("/components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js")}></script>
                <script src={this.getAssetSrc("/components/nouislider/distribute/jquery.nouislider.min.js")}></script>
                <script src={this.getAssetSrc("/components/gsap/src/minified/TweenMax.min.js")}></script>
                <script src={this.getAssetSrc("/components/blueimp-gallery/js/jquery.blueimp-gallery.min.js")}></script>
                <script dangerouslySetInnerHTML={{__html: this.getStateScript()}}></script>
                <script src={this.getAssetSrc("/js/share.min.js")}></script>
                <script src={this.getAssetSrc("/js/main.js")}></script>
                <script src={this.getAssetSrc("/components/jquery-ui/jquery-ui.min.js")}></script>
                <script src={this.getAssetSrc(this.getAppAsset())}></script>
            </body>
            </html>

        );
    },
    getAssetSrc: function (asset) {
        return this.props.context.getAssetUrl(asset);
    },
    getAppAsset: function () {
        return process.env.NODE_ENV === 'production' ? '/build/js/app.min.js' : '/build/js/app.js';
    },
    getStateScript: function () {
        return 'window.App = '+JSON.stringify(this.props.state)+';';
    }
});

module.exports = Html;
