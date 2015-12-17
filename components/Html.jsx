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

var crispHtml = 'CRISP_WEBSITE_ID = "-K5jTtCeVWuGrLefccLq";(function(){ d=document;s=d.createElement("script"); s.src="https://client.crisp.im/l.js"; s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();';

var Html = React.createClass({
    render: function() {
        var title = this.props.context.getStore('MetaStore').getTitle();
        var metas = this.props.context.getStore('MetaStore').getMetas();

        var canonicalUrl = this.props.context.getStore('MetaStore').getCanonicalUrl();
        var canonicalNode = canonicalUrl ? <link rel="canonical" href={canonicalUrl} /> : null;

        return (
            <html className="no-js">
            <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# hairfie: http://ogp.me/ns/fb/hairfie#">
                <meta charSet="utf-8" />
                <title>{title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                {metas.map(function(metaObj) {
                    return <meta property={metaObj.property} name={metaObj.property} content={metaObj.content} />;
                })}
                <meta name="p:domain_verify" content="7da9f1142d3698eff48e81bdc3e77ad6" />
                <meta name="apple-itunes-app" content="app-id=853590611" />

                {canonicalNode}

                <link rel="publisher" href="https://plus.google.com/+Hairfie" />
                <link rel="stylesheet" href={this.getAssetSrc("/css/style.css")} />
                <script src={this.getAssetSrc("/components/modernizr/modernizr.js")}></script>
                <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css' />
                <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700' rel='stylesheet' type='text/css' />
                <link href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/themes/base/jquery-ui.css" rel="stylesheet" type="text/css" />
                <link href={this.getAssetSrc("/components/blueimp-gallery/css/blueimp-gallery.min.css")} rel="stylesheet" type="text/css" />

                <link rel="apple-touch-icon" sizes="57x57" href={this.getAssetSrc("/icons/apple-touch-icon-57x57.png")} />
                <link rel="apple-touch-icon" sizes="60x60" href={this.getAssetSrc("/icons/apple-touch-icon-60x60.png")} />
                <link rel="apple-touch-icon" sizes="72x72" href={this.getAssetSrc("/icons/apple-touch-icon-72x72.png")} />
                <link rel="apple-touch-icon" sizes="76x76" href={this.getAssetSrc("/icons/apple-touch-icon-76x76.png")} />
                <link rel="apple-touch-icon" sizes="114x114" href={this.getAssetSrc("/icons/apple-touch-icon-114x114.png")} />
                <link rel="apple-touch-icon" sizes="120x120" href={this.getAssetSrc("/icons/apple-touch-icon-120x120.png")} />
                <link rel="apple-touch-icon" sizes="144x144" href={this.getAssetSrc("/icons/apple-touch-icon-144x144.png")} />
                <link rel="apple-touch-icon" sizes="152x152" href={this.getAssetSrc("/icons/apple-touch-icon-152x152.png")} />
                <link rel="apple-touch-icon" sizes="180x180" href={this.getAssetSrc("/icons/apple-touch-icon-180x180.png")} />
                <link rel="icon" type="image/png" href={this.getAssetSrc("/icons/favicon-32x32.png")} sizes="32x32" />
                <link rel="icon" type="image/png" href={this.getAssetSrc("/icons/favicon-194x194.png")} sizes="194x194" />
                <link rel="icon" type="image/png" href={this.getAssetSrc("/icons/favicon-96x96.png")} sizes="96x96" />
                <link rel="icon" type="image/png" href={this.getAssetSrc("/icons/android-chrome-192x192.png")} sizes="192x192" />
                <link rel="icon" type="image/png" href={this.getAssetSrc("/icons/favicon-16x16.png")} sizes="16x16" />
                <link rel="manifest" href={this.getAssetSrc("/icons/manifest.json")} />
                <link rel="mask-icon" href={this.getAssetSrc("/icons/safari-pinned-tab.svg")} color="#fe5b5f" />
                <link rel="shortcut icon" href={this.getAssetSrc("/icons/favicon.ico")} />
                <meta name="msapplication-TileColor" content="#ffffff" />
                <meta name="msapplication-TileImage" content={this.getAssetSrc("/icons/mstile-144x144.png")} />
                <meta name="msapplication-config" content={this.getAssetSrc("/icons/browserconfig.xml")} />
                <meta name="theme-color" content="#ffffff" />

                <script type="text/javascript" dangerouslySetInnerHTML={{__html: this.getGaHtml()}} />
            </head>
            <body>

                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}} />
                <div className="oldBrowser" dangerouslySetInnerHTML={{__html: oldBrowserHtml}} />

                <script src={this.getAssetSrc("/components/jquery/dist/jquery.min.js")}></script>
                <script src={this.getAssetSrc("/components/typeahead.js/dist/typeahead.jquery.min.js")}></script>
                <script src={this.getAssetSrc("/components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js")}></script>
                <script src={this.getAssetSrc("/components/nouislider/distribute/jquery.nouislider.min.js")}></script>
                <script src={this.getAssetSrc("/components/gsap/src/minified/TweenMax.min.js")}></script>
                <script src={this.getAssetSrc("/components/gsap/src/minified/plugins/ScrollToPlugin.min.js")}></script>

                <script src={this.getAssetSrc("/components/blueimp-gallery/js/jquery.blueimp-gallery.min.js")}></script>
                <script src={this.getAssetSrc("/js/share.min.js")}></script>
                <script dangerouslySetInnerHTML={{__html: this.getStateScript()}}></script>
                <script src={this.getAssetSrc("/js/main.js")}></script>
                <script src={this.getAssetSrc("/components/jquery-ui/jquery-ui.min.js")}></script>
                <script src={this.getAssetSrc(this.getAppAsset())}></script>

                <div className="heap" dangerouslySetInnerHTML={{__html: this.getHeapHtml()}} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{__html: this.getSchema()}} />
                <script type="text/javascript" dangerouslySetInnerHTML={{__html: crispHtml}} />

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
    },
    getGaHtml: function() {
        return "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', '"+ process.env.GOOGLE_ANALYTICS_TRACKING_CODE + "', 'auto');ga('send', 'pageview');"
    },
    getHeapHtml: function() {
        return '<script type="text/javascript"> window.heap=window.heap||[],heap.load=function(e,t){window.heap.appid=e,window.heap.config=t=t||{};var n=t.forceSSL||"https:"===document.location.protocol,a=document.createElement("script");a.type="text/javascript",a.async=!0,a.src=(n?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";var o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(a,o);for(var r=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},p=["clearEventProperties","identify","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)heap[p[c]]=r(p[c])}; heap.load("'+ process.env.HEAP_ANALYTICS +'");</script>';
    },
    getSchema: function() {
        var markup = {
                  "@context" : "http://schema.org",
                  "@type" : "WebSite",
                  "name" : "Hairfie",
                  "url" : "http://www.hairfie.com"
                };
        return JSON.stringify(markup);
    }
});

module.exports = Html;
