'use strict';

var React = require('react');
var _ = require('lodash');
var PlaceActions = require('../../actions/PlaceActions');
var GeoInput = require('../Form/PlaceAutocompleteInput.jsx');


var LocationInput = React.createClass ({
    contextTypes: {
        executeAction: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return this.getStateFromProps(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
        console.log('STATE', this.state.isGeolocated);
        console.log('nextProps', nextProps);
        this.setState(this.getStateFromProps(nextProps));
        if (this.state.isGeolocated && (nextProps.currentPosition != this.getValue())) {
            this.refs.address.refs.input.value = nextProps.currentPosition;
        }
    },
    getStateFromProps: function(props) {
        return {
            search: props.initialSearch,
            isGeolocated: (this.state && this.state.isGeolocated) || false
        }
    },
    render: function () {

        return (
            <div className="location">
                Localisation
                <div className="input-group">
                    <GeoInput className="form-control" ref="address" type="text" 
                        onChange={this.handleLocationChange} 
                        defaultValue={this.state.search.address != 'France' ? this.state.search.address : ''}/>
                    <div className="input-group-addon"><a role="button" onClick={this.props.onSubmit}>O</a></div>
                </div>
                <div>
                    <button className="btn btn-around" onClick={this.locateMe}>Autour de moi</button>
                </div>
            </div>
        );
    },
    getValue: function () {
        if (this.refs.address.refs.input.value == '') return 'France';
        return this.refs.address.getFormattedAddress();
    },
    locateMe: function() {
        this.setState({isGeolocated: true});
        this.context.executeAction(PlaceActions.getPlaceByGeolocation);
    },
    handleLocationChange: function() {
        this.setState({isGeolocated: false});
    }
});

module.exports = LocationInput;