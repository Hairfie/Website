/** @jsx React.DOM */

'use strict';

var React = require('react');
var _     = require('lodash');

var Html = React.createClass({
    render: function() {
        return (
            <html>
            <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# hairfie: http://ogp.me/ns/fb/hairfie#">
                <meta charSet="utf-8" />
                <title>{this.props.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                {this.props.metas.map(function(metaObj) {
                    return <meta property={metaObj.property} content={metaObj.content} />;
                })}
                <link rel="stylesheet" href="/css/style.css" />
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>

                <script src="/components/jquery/dist/jquery.js"></script>
                <script src="/components/typeahead.js/dist/typeahead.jquery.min.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js"></script>
                <script src="/components/nouislider/distribute/jquery.nouislider.min.js"></script>
                <script src="/components/gsap/src/minified/TweenLite.min.js"></script>

                <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                <script src="/js/share.min.js"></script>
                <script type="text/javascript" src="/build/js/app.js"></script>
            </body>
            </html>

        );
    }
});

module.exports = Html;
