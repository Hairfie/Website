/** @jsx React.DOM */

'use strict';

var React = require('react');
var _ = require('lodash');

module.exports = React.createClass({
    propTypes: {
        min: React.PropTypes.number.isRequired,
        max: React.PropTypes.number.isRequired,
        step: React.PropTypes.number,
        defaultValue: React.PropTypes.number.isRequired,
        onChange: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            onChange: _.noop()
        }
    },
    componentDidMount: function () {
        this.$slider = $(this.refs.slider.getDOMNode());
        this.$slider.noUiSlider(this._buildSliderOptions(this.props));
        this.$slider.on('change', this._onChange);
    },
    componentWillUnmount: function () {
        this.$slider.off('change');
    },
    componentWillReceiveProps: function (nextProps) {
        this.$slider.val(nextProps.defaultValue);
    },
    render: function () {
        return <div ref="slider" />;
    },
    getValue: function () {
        return this.$slider.val();
    },
    _buildSliderOptions: function (props) {
        return {
            start: props.defaultValue,
            range: {
                min: props.min,
                max: props.max
            },
            step: props.step
        };
    },
    _onChange: function () {
        this.props.onChange(this.getValue());
    }
});
