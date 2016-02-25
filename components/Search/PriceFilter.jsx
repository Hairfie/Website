'use strict'

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    propTypes: {
        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        defaultValue: React.PropTypes.shape({
            min: React.PropTypes.number,
            max: React.PropTypes.number
        }),
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            defaultValue: {},
            onChange: _.noop
        };
    },
    getInitialState: function () {
        return {
            displayValue: this.props.defaultValue
        };
    },
    componentDidMount: function () {
        this.slider = jQuery(this.refs.slider).slider({
            min     : this.props.min,
            max     : this.props.max,
            range   : true,
            values  : [
                this.props.defaultMin || this.props.min,
                this.props.defaultMax || this.props.max
            ],
            slide   : this.handleSlide,
            change  : this.handleChange,
        });
    },
    componentWillUnmount: function () {
        this.slider.slider('destroy');
    },
    componentWillReceiveProps: function (nextProps) {
        if (!this.slider) return;
        if (nextProps.defaultMin != this.props.defaultMin) {
            this.slider.slider('values', 0, nextProps.defaultMin);
        }
        if (nextProps.defaultMax != this.props.defaultMax) {
            this.slider.slider('values', 1, nextProps.defaultMax);
        }
        this.slider.slider('option', 'min', nextProps.min);
        this.slider.slider('option', 'max', nextProps.max);
    },
    render: function () {
        var min = Math.max(this.props.min, this.state.displayValue.min || this.props.min);
        var max = Math.min(this.props.max, this.state.displayValue.max || this.props.max);
        var displayClass = this.props.expandedFilters.price ? 'price' : 'price closed';
        if (min > 0 && min == this.props.min) {
            min = '- de '+min;
        }
        if (max == this.props.max) {
            max = '+ de '+max;
        }

        return (
            <div className={displayClass}>
                <h2 onClick={this.props.toggleExpandedFilters}>
                    Prix
                    <span className="chevron">›</span>
                </h2>
                <div className='selectRange'>
                    <div ref="slider" className="rangeslider" />
                    <p className="col-xs-6">De {min}€</p>
                    <p className="col-xs-6">à {max}€</p>
                </div>
            </div>
        );
    },
    getPriceRange: function () {
        if (!this.slider) return this.props.defaultValue;

        return this._makeRange(this.slider.slider('values'));
    },
    handleSlide: function (e, ui) {
        this.setState({displayValue: this._makeRange(ui.values)});
    },
    handleChange: function (e, ui) {
        this.setState({displayValue: this.getPriceRange()});
        this.props.onChange(this.getPriceRange());
    },
    _makeRange: function (v) {
        var r = {};
        if (v[0] > this.props.min) r.min = v[0];
        if (v[1] < this.props.max) r.max = v[1];

        return r;
    }
});
