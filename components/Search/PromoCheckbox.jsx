'use strict';

var React = require('react');
var _ = require('lodash');

var PromoCheckbox = React.createClass ({
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getStateFromProps(nextProps));
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch
        }
    },
    render: function() {
        return (
            <div>
                <label className="checkbox-inline promo-line">
                    <input ref="promo" type="checkbox" align="baseline" onChange={this.handleChange} checked={this.state.search.withDiscount} />
                    Avec une promotion
                </label>
            </div>
        );
    },
    getValue: function () {
        return this.refs.promo.value;
    },
    handleChange: function () {
        this.props.onChange(this.state.search);
    }
});

module.exports = PromoCheckbox;