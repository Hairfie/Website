'use strict';

var React = require('react');
var GeoSuggest = require('react-geosuggest').default;

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
            place: this.props.initialValue
        }
    },
    componentDidMount: function () {
        this.context.getGoogleMapsScript().then(function (google) {
            this.setState({google: google});
        }.bind(this));
    },
    render: function () {
        // console.log("google", this.state.google);
        if(!this.state.google) {
            return null;
        } else {
            return (
                <div>
                    <GeoSuggest
                        type='search'
                        ref='geoSuggest'
                        placeholder="Start typing!"
                        {...this.props}
                        onSuggestSelect={this.onSuggestSelect}
                        googleMaps={this.state.google.maps} />
                </div>
            );
        }
    },
    onSuggestSelect: function(suggest) {
        console.log('Suggest', suggest);
        this.setState({place: suggest});
        // debugger;
    },
    handlePlaceChanged: function () {
        var place = this.autocomplete.getPlace();
        this.props.onPlaceChanged(place);
    },
    getFormattedAddress: function () {
        console.log('getFormattedAddress', this.state.place);
        return this.state.place.label;
        // var place = this.autocomplete.getPlace();
        // if(!place) return this.refs.input.value;
        // return place.formatted_address;
    },
    getValue: function() {
        return this.getFormattedAddress();
    },
    getPlace: function () {
        return this.autocomplete.getPlace();
    }
});
