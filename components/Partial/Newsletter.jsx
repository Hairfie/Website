'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
    render: function () {
        return (
            <div className="newsletter-banner">
                <p className="col-xs-12 col-sm-5 col-md-4 col-lg-3">
                    Ne manquez rien, abonnez-vous à la Newsletter :
                </p>
                <div className="col-xs-6 col-sm-4 col-md-5 col-lg-6">
                    <Input type="email" ref="email" placeholder="Adresse Email *"/>
                </div>
                <a role="button" className='btn btn-red col-xs-4 col-sm-2'>
                    Valider
                </a>
                <div className="col-xs-2 col-sm-1">
                    <a role="button" className="close-newsletter" />
                </div>
            </div>
        );
    }
});
