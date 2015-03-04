/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;
var PublicLayout = require('./PublicLayout.jsx');

module.exports = React.createClass({
    render: function () {
        return (
            <PublicLayout customClass={'home-bg'}>
                <div className="row home">
                    <div className="col-sm-7 col-md-5 col-md-offset-1 left">
                        <h1>
                            Hairfie, l'application qui vous permet de trouver la coiffure et le coiffeur qui vous correspondent !
                        </h1>
                        <div className="trait"></div>
                        <p>
                            Grâce à Hairfie, choisissez le coiffeur qui vous correspond à partir de photos de coiffures et d'avis.
                            N’importe où. N’importe quand.Réservez simplement et bénéficiez de promotions ciblées !
                        </p>

                        <p className="btn-app-store">
                            <a href="https://itunes.apple.com/WebObjects/MZStore.woa/wa/viewSoftware?id=853590611&mt=8" target="_blank" className="btn btn-lg">
                                <img id="btn-apple" src="/img/btn-apple@2x.png" />
                            </a>
                        </p>
                    </div>
                    <div className="col-sm-5 col-md-5 col-md-offset-1 iphone">
                        <img id="iphone" className="img-responsive" src="/img/iphone@2x.png" />
                    </div>
                </div>
            </PublicLayout>
        );
    }
});
