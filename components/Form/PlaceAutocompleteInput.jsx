'use strict';

var React = require('react');
var GeoSuggest = require('react-geosuggest').default;
var classNames = require('classnames');
var _ = require('lodash');

module.exports = React.createClass({
    contextTypes: {
        getGoogleMapsScript: React.PropTypes.func
    },
    propTypes: {
        types: React.PropTypes.array,
        onPlaceChanged: React.PropTypes.func
    },
    getDefaultProps: function () {
        return {
            types: ['geocode'],
            onPlaceChanged: function () {}
        };
    },
    getInitialState: function() {
        return {
            google: null,
            place: null
        }
    },
    componentDidMount: function () {
        this.context.getGoogleMapsScript().then(function (google) {
            this.setState({google: google});
        }.bind(this));
    },
    render: function () {
        if(this.refs.geoSuggest && this.state.place) console.log('render', this.state.place.label);
        if(!this.state.google) {
            return <input style={{width: '100%'}}/>;
        }
        var fixtures = [
            {label: 'Paris, France', location: {lat: 48.856614, lng: 2.3522219}},
            {label: '1er arrondissement, Paris, France', location: {lat: 48.8640493, lng: 2.3310526}},
            {label: '2e arrondissement, Paris, France', location: {lat: 48.8719841, lng: 2.3542239}},
            {label: '15e arrondissement, Paris, France', location: {lat: 48.8421616, lng: 2.2927665}},
            {label: '16e arrondissement, Paris, France', location: {lat: 48.8530933, lng: 2.2487626}},
            {label: '17e arrondissement, Paris, France', location: {lat: 48.891986, lng: 2.319287}},
            {label: '18e arrondissement, Paris, France', location: {lat: 48.891305, lng: 2.3529867}}
        ];
        var clearClass = classNames({
            'clear-geo': true,
            'hidden': _.isEmpty(this.state.place) || _.isEmpty(this.state.place.label)
        });
        return (
            <div>
                <GeoSuggest
                    ref='geoSuggest'
                    placeholder="Saisissez une adresse"
                    onSuggestSelect={this.onSuggestSelect}
                    onChange={this.handleChange}
                    fixtures={fixtures}
                    country={'fr'}
                    googleMaps={this.state.google.maps}
                    autoActivateFirstSuggest={true}
                    className='clearable'
                    {...this.props}
                    />
                <a className={clearClass} onClick={this.clear}>✕</a>
            </div>
        );
    },
    clear: function(e) {
        e.preventDefault();
        this.setState({place: {label: null}});
        this.refs.geoSuggest.clear();
    },
    handleChange: function(userInput) {
        console.log('handleChange', userInput);
        this.setState({place: {label: userInput}});
    },
    onSuggestSelect: function(suggest) {
        this.setState({place: {label: suggest.label}}, this.props.onSuggestChange);
    },
    handlePlaceChanged: function () {
        var place = this.autocomplete.getPlace();
        this.props.onPlaceChanged(place);
    },
    getFormattedAddress: function () {
        return this.state.place && this.state.place.label;
    },
    getValue: function() {
        return this.getFormattedAddress();
    }
});
