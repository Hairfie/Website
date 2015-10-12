'use strict';

var React = require('react');
var _ = require('lodash');
var Link = require('../Link.jsx');
var Picture = require('../Partial/Picture.jsx');

module.exports = React.createClass({
    render: function () {
        var posts = this.props.posts;

        return (
            <section className="home-section blog-posts" id="blog-posts" ref="blog-posts">
                <h2>Les dernières tendances coiffures</h2>
                <div className="section-content-1">
                    <div className="row">
                        {_.map(posts, this.renderPost)}
                    </div>
                    <a href="http://blog.hairfie.com" className="btn btn-red home-cta col-md-3 col-xs-10">
                        Voir toutes les news
                    </a>
                </div>

            </section>
        );
    },
    renderPost: function (post) {
        var content = post.excerpt.rendered.replace(/<(?:.|\n)*?>/gm, '');
        return (
            <div className="col-sm-4 col-xs-12 post" key={post.id} >
                <div className='picture-container'>
                    <a href={post.link} >
                        <Picture picture={{url: post.featured_image_thumbnail_url}} style={{width: '100%'}} placeholder="/img/placeholder-640.png" alt={post.title.rendered}/>
                    </a>
                </div>
                <div className='picture-caption'>
                    <a href={post.link}>
                        <h4>{post.title.rendered}</h4>
                    </a>
                    <a href={post.link} className="address">
                        <p>
                            <span dangerouslySetInnerHTML={{__html:content + ' [...]'}} />
                        </p>
                        <a href={post.link} className="readmore">Lire la suite</a>
                    </a>
                </div>
            </div>
        );
    }
});
