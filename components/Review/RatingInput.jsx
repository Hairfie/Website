'use strict';

var React = require('react');
var _ = require('lodash');
var Input = require('react-bootstrap').Input;
var classNames = require('classnames');

var RatingInput = React.createClass({
    getInitialState: function () {
        return {
            value       : this.props.defaultValue || 0,
            mouseValue  : null
        };
    },
    getDefaultProps: function () {
        return {
            onChange: _.noop
        }
    },
    render: function () {
        return (
            <Input {...this.props}>
                <div className="stars">
                    {[1, 2, 3, 4, 5].map(function (n) { return this.renderStar(n); }.bind(this))}
                </div>
            </Input>
        );
    },
    renderStar: function (n) {
        var value = null == this.state.mouseValue ? this.state.value : this.state.mouseValue,
            on    = value > this._starLowerBound(n);

        var className = classNames({
            star: true,
            full: on,
            on  : on,
            off : !on
        });

        return <a role="button" className={className} style={{margin: '2px'}} onClick={this._selectStar.bind(this, n)} onMouseEnter={this._mouseEnterStar.bind(this, n)} onMouseLeave={this._mouseLeaveStar.bind(this, n)}></a>;
    },
    getValue: function () {
        return this.state.value;
    },
    _mouseEnterStar: function (n) {
        this.setState({mouseValue: this._starValue(n)});
    },
    _mouseLeaveStar: function (n) {
        this.setState({mouseValue: null});
    },
    _selectStar: function (n, e) {
        e.preventDefault();
        this.setState({value: this._starValue(n)}, this.props.onChange);
    },
    _starLowerBound: function (n) {
        return this._starValue(n) - 19;
    },
    _starValue: function (n) {
        return n * 20;
    }
});

module.exports = RatingInput;
