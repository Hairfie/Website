/** @jsx React.DOM */

var React = require('react');

var AuthActions = require('../actions/Auth');
var UserConstants = require('../constants/UserConstants');

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var Google = require('../services/google');

module.exports = React.createClass({
    componentDidMount: function () {
        Google
            .loadMaps()
            .then(function (google) {
                var input = this.refs.businessAddress.getInputDOMNode();

                var options = {};
                options.types = ['geocode'];

                var autocomplete = new google.maps.places.Autocomplete(input, options);

                google.maps.event.addListener(autocomplete, 'place_changed', this.handleBusinessAddressPlaceChanged);

                this.setState({
                    businessAddressAutocomplete: autocomplete
                });
            }.bind(this));
    },
    getInitialState: function () {
        return {
            businessAddress             : null,
            businessGps                 : null,
            businessAddressAutocomplete : null
        };
    },
    render: function () {
        return (
            <PublicLayout context={this.props.context} withLogin={true} customClass={'home-pro'}>
                <div className="row first">
                    <div className="col-sm-7 col-md-5 col-md-offset-1 left">
                        <h1>Augmentez votre visibilité et votre chiffre d'affaires</h1>
                        <hr />
                        <p className="list">
                            <ul>
                                <li><span>Gagnez en <strong>visibilité</strong> sur le web et les réseaux sociaux</span></li>
                                <li><span><strong>Différenciez-vous</strong> de vos concurrents</span></li>
                                <li><span>Augmentez votre <strong>chiffre d'affaires</strong></span></li>
                                <li><span>Gagnez du <strong>temps</strong> et concentrez vous sur votre métier</span></li>
                            </ul>
                        </p>

                        <p className="btn-app-store">
                            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                                <img id="btn-apple" src="/img/btn-apple@2x.png" />
                            </a>
                        </p>
                    </div>

                    <div className="col-sm-5 col-md-4 col-md-offset-1">
                        <form role="form" className="claim">
                            <h3>Vous êtes un <strong>professionnel</strong> de la coiffure ?</h3>
                            <Input className="radio">
                                <label className="radio-inline">
                                  <input type="radio" name="gender" ref="userGender" value={UserConstants.Genders.MALE} />
                                  Homme
                                </label>
                                <label className="radio-inline">
                                  <input type="radio" name="gender" ref="userGender" value={UserConstants.Genders.FEMALE} />
                                  Femme
                                </label>
                            </Input>
                            <Input ref="userFirstName" type="text"  placeholder="Prénom" />
                            <Input ref="userLastName" type="text" placeholder="Nom" />
                            <Input ref="userEmail" type="email" placeholder="Email" />
                            <Input ref="userPassword" type="password" placeholder="Choisissez un mot de passe" />
                            <hr />
                            <Input ref="businessName" type="text" placeholder="Nom de votre société" />
                            <Input ref="businessAddress" type="text" placeholder="Adresse postale" />
                            <Input ref="businessPhoneNumber" type="text" placeholder="Numéro de téléphone" />
                            <Button className="btn-red btn-block" onClick={this.submit}>Commencer maintenant !</Button>
                        </form>
                    </div>
                </div>
            </PublicLayout>
        );
    },
    submit: function (e) {
        e.preventDefault();
        this.props.context.executeAction(AuthActions.Signup, {
            user        : {
                gender      : this.refs.userGender.getDOMNode().value,
                firstName   : this.refs.userFirstName.getValue(),
                lastName    : this.refs.userLastName.getValue(),
                email       : this.refs.userEmail.getValue(),
                password    : this.refs.userPassword.getValue()
            },
            business    : {
                name        : this.refs.businessName.getValue(),
                phoneNumber : this.refs.businessPhoneNumber.getValue(),
                address     : this.state.businessAddress,
                gps         : this.state.businessGps
            }
        });
    },
    handleBusinessAddressPlaceChanged: function () {
        var place   = this.state.businessAddressAutocomplete.getPlace(),
            address = addressFromPlace(place),
            gps     = gpsFromPlace(place);

        this.setState({
            businessAddress : address,
            businessGps     : gps
        });
    }
});

function addressFromPlace(place) {
    var parts = {};

    if (place && place.address_components) {
        place.address_components.map(function (component) {
            switch (component.types[0]) {
                case 'street_number':
                    parts.streetNumber = component.short_name;
                    break;
                case 'route':
                    parts.streetName = component.long_name;
                    break;
                case 'locality':
                    parts.city = component.long_name;
                    break;
                case 'postal_code':
                    parts.zipCode = component.short_name;
                    break;
                case 'country':
                    parts.country = component.short_name;
                    break;
            }
        });
    }

    return {
        street  : [parts.streetNumber, parts.streetName].join(' '),
        city    : parts.city,
        zipCode : parts.zipCode,
        country : parts.country
    };
}

function gpsFromPlace(place) {
    if (place && place.geometry && place.geometry.location) {
        return {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
        };
    }
}
