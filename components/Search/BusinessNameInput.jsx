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
                <span className='title'>Nom du salon</span>
                <hr className='underliner'/>
                <div className="input-group">
                    <input className="form-control" ref="query" type="text" defaultValue={this.state.search.q}/>
                    <div className="input-group-addon"><a role="button" onClick={this.handleSubmit}> </a></div>
                </div>
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
