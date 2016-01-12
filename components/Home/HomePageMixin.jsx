'use strict';

var HomePageMixin = {
    componentDidMount: function () {
        // animation
        // TweenMax.set('.headline', {opacity:0,top:30});
        // TweenMax.set('.searchbar.hidden-xs', {opacity:0,marginTop:'-=20'});
        // TweenMax.set('.landing header.hidden-xs', {opacity:0});
        // TweenMax.to('.landing header.hidden-xs', 1, {
        //     opacity:1,
        //     ease:Power4.easeInOut
        // });
        // TweenMax.to('.headline', 0.7, {
        //     opacity:1,
        //     top:0,
        //     ease:Power4.easeInut,
        //     delay:0.5
        // });
        // TweenMax.to('.searchbar.hidden-xs', 0.7, {
        //     opacity:1,
        //     marginTop:'+=20',
        //     ease:Power4.easeOut,
        //     delay:0.65
        // });

    },
    componentWillUnmount: function() {
        $('body').removeClass('locked');
    }
};

module.exports = HomePageMixin;
