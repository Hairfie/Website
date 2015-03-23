/** @jsx React.DOM */

'use strict';

var React = require('react');

module.exports = React.createClass({
    render: function () {
        return (
            <div>
                <div className="container">
                    <header className="white">
                        <div className="row">
                            <div className="col-md-12">
                                <a href="index.html" className="logo col-md-4"></a>
                                <nav className='col-md-8 pull-right'>
                                    <ul>
                                        <li><a href="#">Inscription</a></li>
                                        <li><a href="#">Connexion</a></li>
                                        <li className="user">
                                            <div className="dropdown">
                                                <img src="http://lucasfayolle.com/hairfie/images/placeholder-user-pp.jpg" alt="#" />
                                                <a id="dLabel" data-target="#" href="http://example.com" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false">
                                                    Natasha
                                                    <span className="caret"></span>
                                                </a>
                                                <ul className="dropdown-menu" role="menu" aria-labelledby="dLabel" />
                                            </div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </header>
                    <div className="row">
                        <div className="searchbar small-search col-sm-12">
                            <input type="search" placeholder="Où ?" className="col-sm-7" />
                            <input type="date" className="col-sm-2"/>
                            <a href="#" className="btn btn-red col-sm-2">Trouvez votre coiffeur</a>
                        </div>
                    </div>
                </div>
                {this.props.children}
                <div className="clearfix" />
                <footer>
                    <div className="container">
                        <div className="row">
                            <ul className="footer-links col-md-7">
                                <li className="col-sm-2"><a href="#">À propos</a></li>
                                <li className="col-sm-2"><a href="#">Presse</a></li>
                                <li className="col-sm-2"><a href="#">Blog</a></li>
                                <li className="col-sm-4"><a href="#">Conditions Générales</a></li>
                                <li className="col-sm-2"><a href="#" className="btn btn-red">Déclarez votre salon</a></li>
                            </ul>
                        </div>
                        <div className="row">
                            <div className="hr col-sm-10 col-xs-10"></div>
                        </div>
                        <h4>Rejoignez-nous sur :</h4>
                        <div className="row">
                            <ul className="social-links col-md-3">
                                <li><a href="#" className='icon'>b</a></li>
                                <li><a href="#" className='icon'>a</a></li>
                                <li><a href="#" className='icon'>c</a></li>
                                <li><a href="#" className='icon'>x</a></li>
                                <li><a href="#" className='icon'>d</a></li>
                            </ul>
                        </div>
                        <p>© Hairfie, Inc.</p>
                    </div>
                </footer>
            </div>
        );
    }
});
