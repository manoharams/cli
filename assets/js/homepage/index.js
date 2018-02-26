'use strict';

(function () {
    'use strict';

    var initHeroCarousel = function initHeroCarousel() {
        var $carousel = $('.js-initHeroCarousel');

        if ($carousel.length) {
            $carousel.slick({
                autoplay: true,
                autoplaySpeed: 3000
            });
        }
    };

    $(document).ready(function () {

        initHeroCarousel();
    });
})();