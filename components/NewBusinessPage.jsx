/** @jsx React.DOM */

'use strict';

var React = require('react');

var BusinessActions = require('../actions/Business');

var Layout = require('./ProLayout.jsx');
var GeneralForm = require('./Business/GeneralForm.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <Layout context={this.props.context}>
                <GeneralForm ref="form" />

                <button className="btn btn-default" onClick={this.save}>
                    Continue
                </button>
            </Layout>
        );
    },
    save: function () {
        this.props.context.executeAction(BusinessActions.Save, {
            values: this.refs.form.getValues(),
        });
    }
});
