'use strict';

var React = require('react');
var _ = require('lodash');
var classNames = require('classnames');

var PriceFilterMobile = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            selectAll: false,
            displayPrices: false
        }
    },
    render: function() {
        if(this.props.cat != 'PriceFilterMobile') return null;
        var displayPrices = classNames({
            'prices': true,
            'hidden': !this.state.displayPrices
        });
        return (
            <div className="new-filters subfilters">
                <button onClick={this.handleClose} className="btn btn-red previous">Précédent</button>
                <div className="filter-header">
                    <div className="header-title">
                        Prix :
                    </div>
                </div>
                {_.times(4, function(i) {
                    var iPriceLevel = (i+1).toString();
                    var active   = this.state.search && (this.state.search.priceLevel || []).indexOf(iPriceLevel) > -1;
                    var onChange = active ? this.removePrice.bind(this, iPriceLevel) : this.addPrice.bind(this, iPriceLevel);
                    return (
                        <label key={i} className="checkbox-inline">
                            <input type="checkbox" align="baseline" onChange={onChange} checked={active} />
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
                <div className="filter-footer">
                    <button onClick={this.handleClose} className="btn btn-red full">Valider</button>
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
    handleClose: function() {
        this.props.onClose(this.state.search);
    },
    addPrice: function (priceLevel) {
        this.setState({search: _.assign({}, this.state.search,{priceLevel: _.union(this.state.search.priceLevel || [], [priceLevel])})});
    },
    removePrice: function (priceLevel) {
        this.setState({search: _.assign({}, this.state.search,{priceLevel: _.without(this.state.search.priceLevel, priceLevel)})});
    }

});

module.exports = PriceFilterMobile;
