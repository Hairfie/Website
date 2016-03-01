'use strict';

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    render: function () {
        var business = this.props.business || {};

        if (!business || !business.priceLevel) return null;

        var i = 0;
        var price = [];
        for (i = 0; i < 4; i++) {
          if (i < (business.priceLevel || 0)) {
            price.push(<span key={i} className="glyphicon glyphicon-euro"></span>);
          }
          else {
            price.push(<span key={i} className="glyphicon glyphicon-euro" style={{opacity: 0.5}}></span>);
          }
        }

        return (
            <p {...this.props}>
                {price}
            </p>
        );
    }
});