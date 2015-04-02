'use strict';

var React = require('react');
var FluxibleMixin = require('fluxible').Mixin;
var UserSuggestionStore = require('../../stores/UserSuggestionStore');
var Input = require('react-bootstrap/Input');
var UserProfilePicture = require('../Partial/UserProfilePicture.jsx');

var Suggestion = React.createClass({
    render: function () {
        var user = this.props.user;

        return (
            <p>
                <UserProfilePicture user={user} resolution={{width: 32, height: 32}} /> {user.firstName} {user.lastName}
            </p>
        );
    }
});

module.exports = React.createClass({
    mixins: [FluxibleMixin],
    statics: {
        storeListeners: [UserSuggestionStore]
    },
    getDefaultProps: function () {
        return {
            onUserChange: function () {}
        };
    },
    componentDidMount: function () {
        var options = {};
        options.minLength = 1;

        var templates = {};
        templates.suggestion = this._templateSuggestion;

        var dataset = {};
        dataset.name = 'users';
        dataset.source = this.lookup;
        dataset.displayKey = this._displayKey;
        dataset.templates = templates;

        var $input = jQuery(this.refs.input.getInputDOMNode());
        $input.typeahead(options, dataset);
        $input.on('typeahead:selected', this._handleSelected);
        $input.on('typeahead:closed', this._handleClosed);

        this._updateInputFromSelection();
    },
    componentWillUnmount: function () {
        jQuery(this.refs.input.getInputDOMNode()).typeahead('destroy');
    },
    getInitialState: function () {
        return {
            query    : null,
            callback : null,
            user     : this.props.defaultUser
        };
    },
    render: function () {
        return <Input ref="input" type="text" {...this.props} onBlur={this._handleBlur} />;
    },
    lookup: function (query, process) {
        this.setState({
            query   : query,
            process : process
        });

        this.onChange();
    },
    onChange: function () {
        if (this.state.process) {
            var suggestions = this.getStore(UserSuggestionStore).getSuggestionsForQuery(this.state.query);

            if (suggestions) {
                this.state.process(suggestions);
                this.setState({process: null});
            }
        }
    },
    setUser: function (user) {
        if (user == this.state.user) return;

        this.setState({user: user});
        this._updateInputFromSelection();

        this.props.onUserChange(user);
    },
    getUser: function () {
        return this.state.user;
    },
    _handleSelected: function (e, user) {
        this.setUser(user);
    },
    _handleBlur: function () {
        this._updateInputFromSelection();
    },
    _handleClosed: function (e) {
        this._updateInputFromSelection();
    },
    _updateInputFromSelection: function (e) {
        this.refs.input.getInputDOMNode().value = this._displayKey(this.state.user);
    },
    _displayKey: function (user) {
        if (!user) return '';

        return user.firstName+' '+user.lastName;
    },
    _templateSuggestion: function (user) {
        return React.renderToStaticMarkup(<Suggestion user={user} />);
    }
});
