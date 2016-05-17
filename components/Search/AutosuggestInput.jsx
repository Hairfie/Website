'use strict';

var React = require('react');
var _ = require('lodash');
var Autosuggest = require('react-autosuggest');

var AutosuggestInput = React.createClass({
    getInitialState: function () {
        return {
            value: '',
            suggestions: _.map(this.props.tags, function(tag) {
                return {text: tag.name}
            })
        };
    },
    componentDidMount: function() {
        document.addEventListener('keydown', this.keyListener);
    },
    keyListener: function (e) {
        if(e.keyCode == 13) {
            e.preventDefault();
        }
    },
    render: function() {
        var suggestions = _.map(this.props.tags, function(tag) {
            return {text: tag.name}
        });
        
        var inputProps = {
            value: this.state.value,  
            onChange: this.onChange,
            type: 'search',
            placeholder: 'Ex: Lissage, Afro, Chignon, etc...'
        };
        return (
            <Autosuggest 
                ref='autosuggest'
                suggestions={this.state.suggestions}
                getSuggestionValue={this.getSuggestionValue}
                renderSuggestion={this.renderSuggestion}
                onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                onSuggestionSelected={this.onSuggestionSelected}
                inputProps={inputProps}
                onKeyDown={this.handleKey}
                focusInputOnSuggestionClick={false} />
        );
    },
    onChange: function(e, infos) {
        e.preventDefault();
        this.setState({value: infos.newValue});
    },
    onSuggestionSelected: function(e, obj) {
        this.props.addTag(obj.suggestionValue);
        this.setState({value: ''});
    },
    getSuggestionValue: function(suggestion) {
        return suggestion.text;
    },
    renderSuggestion: function(suggestion) {
        return (
            <span>{suggestion.text}</span>
        );
    },
    getSuggestions: function(value) {
        var regex = new RegExp (value.value, 'i');
        return _.slice(_.map(_.filter(this.props.tags, function(tag) {return tag.name.match(regex)}), function(tag) {
            return {text:tag.name}
        }), 0, 10);
    },
    onSuggestionsUpdateRequested: function(value) {
        this.setState({suggestions: this.getSuggestions(value)});
    }

});

module.exports = AutosuggestInput;

