'use strict';

(function () {
    'use strict';

    var fadeInOnScroll = function fadeInOnScroll() {
        var $elementsToFadeIn = $('.js-fadeInOnScroll');

        $.each($elementsToFadeIn, function (i, el) {
            var $el = $(el);
            var animationClass = $el.data('animation-class') || 'fadeIn';
            // hide the elements that will be faded in on scroll.
            // we're not doing with CSS just in case this script
            // doesn't load.
            $el.css('visibility', 'hidden');
            // show the elements at the given waypoint
            var waypoint = new Waypoint({
                element: $el[0],
                handler: function handler() {
                    $el.addClass(animationClass) // use animate.css for consistent animations
                    .css('visibility', 'visible'); // make the element visible
                },
                offset: function offset() {
                    // show the element when it's 50% visible
                    return this.context.innerHeight() - this.adapter.outerHeight() + this.element.offsetHeight * .5;
                }
            });
        });
    };

    var initStickyNav = function initStickyNav() {
        // find the stickyNav wrapper
        var $stickyNav = $('.js-initStickyNav');

        if ($stickyNav) {
            // get the nav container
            var $navContainer = $stickyNav.find('.js-stickyNavContainer');
            // get the height of the nav container
            var height = $navContainer.height();
            // set the height of the wrapper so the page doesn't jump
            $stickyNav.height(height);
            // do the thing to make it sticky
            var waypoint = new Waypoint({
                element: $('.js-showNavHere'),
                handler: function handler() {
                    $navContainer.toggleClass('is-sticky');
                },
                offset: 0
            });
        }
    };

    var smoothScroll = function smoothScroll() {
        var $elementsToClick = $('.js-smoothScroll');

        if ($elementsToClick) {
            $elementsToClick.click(function () {
                if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') || location.hostname === this.hostname) {
                    var target = $(this.hash);
                    target = target.length ? target : $('[name=\'' + this.hash.slice(1) + '\']');

                    if (target.length) {
                        $('html, body').animate({
                            scrollTop: target.offset().top - 90
                        }, 1000);
                        return false;
                    }
                }
            });
        }
    };

    $(document).ready(function () {

        fadeInOnScroll();
        initStickyNav();
        smoothScroll();
    });
})();