'use strict';

var React = require('react');
var _ = require('lodash');

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
            selectAll: false
        }
    },
    render: function() {
        if(this.props.cat != 'PriceFilterMobile') return null;
        var men = ['0-20€', '21-30€', '31-49€', '> 50€'];
        var women = ['0-30€', '31-50€', '51-79€', '> 79€'];
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
                            <span className='price-notice'>{'(Hommes: ' + men[i] + ') - (Femmes : ' + women[i] + ')' }</span>
                        </label>
                    )
                }, this)}
                <div className="filter-footer">
                    <button onClick={this.handleClose} className="btn btn-red full">Valider</button>
                </div>
            </div>
        );
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
