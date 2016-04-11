'use strict'

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onChange: _.noop
        };
    },
    render: function () {
        var displayClass = this.props.expandedFilters.price ? 'price' : 'price closed';

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
                </div>
            </div>
        );
    },
    renderPriceLevel: function(i) {
        return (
            <span>
                {_.times(i, function(i){
                    return <i key={i} className="glyphicon glyphicon-euro" />
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
