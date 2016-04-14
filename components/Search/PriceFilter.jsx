'use strict'

var React = require('react');
var _ = require('lodash');
var classNames = require('classnames');

module.exports = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onChange: _.noop
        };
    },
    getInitialState: function() {
        return {
            displayPrices: false
        };
    },
    render: function () {
        var displayClass = this.props.expandedFilters.price ? 'price' : 'price closed';
        var displayPrices = classNames({
            'prices': true,
            'hidden': !this.state.displayPrices
        });
        console.log('displayPrices', this.state.displayPrices);
        return (
            <div className={displayClass}>
                <h2 onClick={this.props.toggleExpandedFilters}>
                    Prix {this.props.categoryCount}
                    <span className="chevron">›</span>
                </h2>
                <hr className='underliner'/>
                <div className='tag-list'>
                    {_.times(4, function(i){
                        return (
                            <label key={i} className="checkbox-inline">
                                <input type="checkbox" align="baseline" onChange={this.handleChange.bind(this, i)} checked={_.includes(this.props.priceLevel, (i+1).toString())} />
                                <span />
                                {this.renderPriceLevel(i + 1)} 
                            </label>
                        )
                    }, this)}
                    <div className='price-details'>
                        <a onClick={this.displayPrices}>Voir le détail</a>
                        <div className={displayPrices}>
                            <span>Homme &lt; 20€ / Femme &lt; 30€</span>
                            <span>Homme &lt; 30€ / Femme &lt; 50€</span>
                            <span>Homme &lt; 49€ / Femme &lt; 79€</span>
                            <span>Homme &gt; 50€ / Femme &gt; 80€</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    displayPrices: function() {
        this.setState({displayPrices: !this.state.displayPrices});
    },
    renderPriceLevel: function(i) {
        return (
            <span>
                {_.times(i, function(i){
                    return '€'
                })}
            </span>
        );
    },
    handleChange: function (i) {
        var nextPriceArr = this.props.priceLevel || [];
        if(_.includes(nextPriceArr, (i+1).toString())) {
            nextPriceArr = _.without(nextPriceArr, (i+1).toString())
        } else {
            nextPriceArr.push((i+1).toString())
        }
        this.props.onChange(nextPriceArr);
    }
});
