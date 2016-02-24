'use strict';

var React = require('react');
var _ = require('lodash');

var BusinessNameInput = React.createClass ({
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
            <div className="business-name">
                Nom du salon
                    <input className="form-control" ref="query" type="text" defaultValue={this.state.search.q}/>
            </div>
        );
    },
    getValue: function () {
        return this.refs.query.value;
    },
    handleSubmit: function () {
        this.props.onSubmit(this.state.search);
    }
});

module.exports = BusinessNameInput;
