/** @jsx React.DOM */

var React = require('react');
var NavLink = require('flux-router-component').NavLink;

module.exports = React.createClass({
    render: function () {

        return (
            <footer className="visible-md visible-lg">
                <div className="container">
                    <div className="row">
                        <ul className="footer-links col-md-7">
                        <li className="col-sm-2"><a href="http://blog.hairfie.com/">À propos</a></li>
                        <li className="col-sm-2"><a href="#">Presse</a></li>
                        <li className="col-sm-2"><a href="http://blog.hairfie.com/">Blog</a></li>
                        <li className="col-sm-4"><a href="http://api.hairfie.com/public/mentions_legales_v3_fr.pdf" target="_blank">Conditions Générales</a></li>
                        <li className="col-sm-2"><NavLink context={this.props.context} routeName="pro_home" className="btn btn-red">Gérez votre salon</NavLink></li>

                        </ul>
                    </div>
                    <div className="row">
                        <div className="hr col-sm-10 col-xs-10"></div>
                    </div>
                    <h4>Rejoignez-nous sur :</h4>
                    <div className="row">
                        <ul className="social-links col-md-3">
                            <li><a href="https://www.facebook.com/pages/Hairfie/1507026002849084" target="_blank" className='icon'>b</a></li>
                            <li><a href="https://twitter.com/HairfieApp" target="_blank" className='icon'>a</a></li>
                            <li><a href="https://plus.google.com/+Hairfie" target="_blank" className='icon'>c</a></li>
                            <li><a href="https://instagram.com/HairfieApp" target="_blank" className='icon'>x</a></li>
                            <li><a href="https://www.pinterest.com/hairfie/" target="_blank" className='icon'>d</a></li>
                        </ul>
                    </div>
                    <p>© Hairfie 2015</p>
                </div>
            </footer>
        );
    }
});
