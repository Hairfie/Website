'use strict';

var React = require('react');
var Input = require('react-bootstrap').Input;

module.exports = React.createClass({
    render: function () {
        return (
            <div style={{backgroundColor: 'white', overflow: 'auto', width: '100%', paddingLeft: '25px', paddingRight: '25px', marginTop: '5px'}}>
                <p style={{float: 'left', lineHeight: '30px', fontSize: '1.3em', fontWeight: 'bolder'}}>
                    Ne manquez rien, abonnez-vous à la Newsletter :
                </p>
                <div className="col-xs-6 col-sm-4 col-md-3 col-lg-2">
                    <Input type="email" ref="email" placeholder="Adresse Email *"/>
                </div>
                <a role="button" className='btn btn-red'>
                    Valider
                </a>
            </div>
        );
    }
});
