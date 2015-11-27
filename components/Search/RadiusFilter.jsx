'use strict';

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    propTypes: {
        step: React.PropTypes.number,
        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        defaultValue: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            step: 1000, // step by km by default
            onChange: _.noop
        }
    },
    getInitialState: function () {
        return {
            displayValue: this.props.defaultValue || 1000
        };
    },
    componentDidMount: function () {
        this.slider = jQuery(this.refs.slider).slider({
            min: this.props.min,
            max: this.props.max,
            step: this.props.step,
            value: this.props.defaultValue,
            slide: this.handleSlide,
            change: this.handleChange
        });
    },
    componentWillUnmount: function () {
        this.slider.slider('destroy');
    },
    componentWillReceiveProps: function (nextProps) {
        if (!this.slider) return;
        this.slider.slider('option', 'min', nextProps.min);
        this.slider.slider('option', 'max', nextProps.max);
        this.slider.slider('option', 'step', nextProps.step);
    },
    render: function () {
        return (
            <div className="price">
                <h2>Rayon autour de l'adresse</h2>
                <div className="selectRange">
                    <div ref="slider" className="rangeslider" />
                    <p className="col-xs-6">{this.state.displayValue / 1000}km</p>
                </div>
            </div>
        );
    },
    handleSlide: function (e, ui) {
        this.setState({displayValue: ui.value});
    },
    handleChange: function (e, ui) {
        this.setState({displayValue: ui.value});
        this.props.onChange(ui.value);
    },
    getValue: function () {
        return this.slider && this.slider.slider('value');
    }
});
