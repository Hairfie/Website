/** @jsx React.DOM */

var React = require('react');

var ProLayout = require('./ProLayout.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <ProLayout context={this.props.context}>
                <h3>Dashboard</h3>
            </ProLayout>
        );
    }
});
