'use strict';

var React = require('react');

var UserGenders = require('../constants/UserConstants').Genders;
var BusinessKinds = require('../constants/BusinessConstants').Kinds;

var BusinessLeadActions = require('../actions/BusinessLeadActions');

var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

var Row = require('react-bootstrap/Row');
var Col = require('react-bootstrap/Col');
var Input = require('react-bootstrap/Input');
var Button = require('react-bootstrap/Button');

var UUID = require('uuid');

var _ = require('lodash');

var RadioChoice = React.createClass({
    getInitialState: function () {
        return {
            name : UUID.v4()
        };
    },
    render: function () {
        var choiceNodes = _.map(this.props.choices, this.renderChoice);

        return <Input className="radio">{choiceNodes}</Input>;
    },
    renderChoice: function (choice) {
        return (
            <label key={choice.value} className="radio-inline">
              <input ref={choice.value} type="radio" name={this.state.name} value={choice.value} />
              {choice.label}
            </label>
        );
    },
    getValue: function () {
        var value = null;
        _.map(this.props.choices, function (choice) {
            if (this.refs[choice.value].getDOMNode().checked) value = choice.value;
        }, this);
        return value;
    }
});

var KindChoice = React.createClass({
    render: function () {
        var choices = [];
        choices.push({label: 'En Salon', value: BusinessKinds.SALON});
        choices.push({label: 'À domicile', value: BusinessKinds.HOME});

        return <RadioChoice ref="choice" choices={choices} />
    },
    getValue: function () {
        return this.refs.choice.getValue();
    }
});

module.exports = React.createClass({
    contextTypes: {
        makePath: React.PropTypes.func.isRequired,
        executeAction: React.PropTypes.func.isRequired

    },
    render: function () {
        return (
            <PublicLayout withProLink={false}>
                <section className="home-pro">
                    <div className="row first">
                        <div className="col-xs-10 col-sm-6 col-sm-offset-3 col-xs-offset-1 claim">
                            <form role="form">
                                <h3>Vous êtes un <strong>professionnel</strong> de la coiffure ?</h3>
                                <p>Laissez-nous vos coordonnées, nous vous recontacterons pour vous présenter nos services</p>

                                <KindChoice ref="businessKind" />
                                <Input ref="businessName" type="text" placeholder="Nom de votre salon" />
                                <Input ref="phoneNumber" type="text" placeholder="Un numéro de téléphone" />
                                <Input ref="email" type="email" placeholder="Email" />
                                <Button className="btn-red btn-block" onClick={this.submit}>Laisser mes coordonnées</Button>
                            </form>
                            <div className="contact">
                                <h6>Une question ? Une suggestion ?</h6>
                                <h4>Contactez-nous au <a href="tel:+33185089169">+33 1 85 08 91 69</strong> ou <a href="mailto:hello@hairfie.com">hello@hairfie.com</a></h4>
                            </div>
                        </div>
                    </div>
                </section>
                {/*<section className="home-section">
                    <div className="row">
                        <div className="col-sm-4 col-sm-offset-1">
                            <h3>Internet sans vous couper les cheveux en 4</h3>
                            <p>Tirez partie du Web en montrant votre travail et savoir-faire grâce aux Hairfie</p>
                        </div>
                        <div className="col-sm-4 col-sm-offset-1">
                            <img src="/img/pro-1.png" alt="#" />
                        </div>
                    </div>
                </section> */}
            </PublicLayout>
        );
    },
    submit: function (e) {
        e.preventDefault();
        this.context.executeAction(BusinessLeadActions.submit, {
            businessLead        : {
                kind        : this.refs.businessKind.getValue(),
                name        : this.refs.businessName.getValue(),
                phoneNumber : this.refs.phoneNumber.getValue(),
                email       : this.refs.email.getValue()
            }
        });
    }
});