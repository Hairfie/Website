'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var classNames = require('classnames');
var connectToStores = require('fluxible-addons-react/connectToStores');

var BusinessForHairfies = React.createClass ({

    render: function() {
        var business = this.props.business;

        var ratingClass = classNames({
            'rating-stars': true,
            'hidden': _.isNull(business.rating)
        });
        return (
            <div className='col-xs-12 col-sm-8 single-business'>
                <div className='business'>
                    <div className='background-image' style={{backgroundImage: 'url(' + business.pictures[0].url + ')'}}/>
                    <div className='business-infos'>
                        <span className='name'>{business.name}</span>
                        <span className='city'>{business.address.zipCode + ' ' + business.address.city}</span>
                        <div className={ratingClass}>{this.averageRating()} {' - ' + business.numReviews + ' avis'}</div>
                        <span className='price'>{this.priceLevel()}</span>
                            {this.renderSelection()}
                        <button className='btn btn-book'>Voir le salon</button>
                    </div>
                </div>
            </div>
        );
    },
    renderSelection: function() {
        if (!this.props.business.selections) return null;
        var selection = _.filter(this.props.selections, function (sel) { 
                                return _.include(this.props.business.selections, sel.id)
                            }, this);
        return (
            <span className='selection-container'>
                <span className='selection'>{_.first(selection).label}</span>
            </span>
        );
    },
    priceLevel: function() {
        if (!this.props.business.priceLevel) return;
        var priceLevel = this.props.business.priceLevel;
        return (
            <div className='price-level'>
                {[1, 2, 3, 4].map(function (n) { 
                    if (n <= priceLevel) return <span key={n+'€'} className='white'>€</span>
                    else return <span key={n+'€'} className='grey'>€</span>
                })}
            </div>
        );
    },
    averageRating: function() {
        if (!this.props.business) return;
        var avg = Math.round(this.props.business.rating / 20);
        return (
            <div className="stars">
                {[1, 2, 3, 4, 5].map(function (n) { return this.renderStar(n, avg); }.bind(this))}
            </div>
        );
    },
    renderStar: function(n, avg) {

        var on = n <= Math.round(avg);
        var className = classNames({
            star: true,
            full: on,
            on  : on,
            off : !on
        });
        return <a key={n} className={className}></a>;

    }
});

BusinessForHairfies = connectToStores(BusinessForHairfies, [
    'SelectionStore'
], function (context, props) {
    return {
        selections : context.getStore('SelectionStore').getSelections()
    };
});

module.exports = BusinessForHairfies;