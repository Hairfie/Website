
'use strict';
var React = require('react');

var Html = React.createClass({

    render: function() {
        return (
            <html>
            <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# hairfie: http://ogp.me/ns/fb/hairfie#">
                <meta charSet="utf-8" />
                <title>{this.props.title}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
                <link rel="stylesheet" href="/css/style.css" />
                <link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600' rel='stylesheet' type='text/css' />
            </head>
            <body>
                <div id="app" dangerouslySetInnerHTML={{__html: this.props.markup}}></div>

                <script src="/components/jquery/dist/jquery.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/affix.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/alert.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/button.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/carousel.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/collapse.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/dropdown.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/tab.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/transition.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/scrollspy.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/tooltip.js"></script>
                <script src="/components/bootstrap-sass-official/assets/javascripts/bootstrap/popover.js"></script>

                <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                <script src="/js/maps.js"></script>
                <script src="/js/share.min.js"></script>
                <script type="text/javascript" src="/js/app.js"></script>
            </body>
            </html>

        );
    }
});

module.exports = Html;