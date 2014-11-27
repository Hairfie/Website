/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <PublicLayout context={this.props.context} customClass={'home-bg'}>
                <div className="row home">
                    <div className="col-sm-5 col-sm-offset-2" id="txt">
                        <h1>
                            Hairfie, l'App qui vous permet de trouver et de réserver la coiffure et le coiffeur qui vous correspondent !
                        </h1>
                        <div className="trait"></div>
                        <p>
                            Grâce à Hairfie, choisissez le coiffeur qui vous correspond à partir de photos de coiffures et d'avis.
                            N’importe où. N’importe quand.Réservez simplement et bénéficiez de promotions ciblées !
                        </p>

                        <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="center">
                            <img id="btn-apple" src="/img/btn-apple@2x.png" />
                        </a>
                    </div>
                    <div className="col-sm-3">
                        <img id="iphone" className="center" src="/img/iphone@2x.png" />
                    </div>
                </div>
            </PublicLayout>
        );
    }
});
