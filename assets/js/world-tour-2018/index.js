'use strict';

(function () {
    'use strict';

    var initHeroCarousel = function initHeroCarousel() {
        var $carousel = $('.js-initHeroCarousel');

        if ($carousel.length) {
            $carousel.on('init', function (event, slick, direction) {
                $carousel.find('img').removeClass('hidden');
            }).slick({
                autoplay: true,
                autoplaySpeed: 3000,
                arrows: false
            });
        }
    };

    var initLazyLoad = function initLazyLoad() {
        var $imageEls = $('.js-lazyLoad');

        if ($imageEls.length) {
            $imageEls.Lazy();
        }
    };

    var filterVideosByCategory = function filterVideosByCategory() {
        var $filterEl = $('.js-filterVideos');

        if ($filterEl.length) {

            var options = {
                valueNames: ['categories', { data: ['categories'] }]
            };
            var videosList = new List('videos', options);

            filterVideos($filterEl.val(), videosList);

            $filterEl.change(function () {
                filterVideos(this.value, videosList);
                $(window).scroll(); // trigger scroll event for lazyload
            });
        }
    };

    function filterVideos(selection, list) {
        if (selection === 'all') {
            // clear filter
            list.filter();
        } else {
            // apply filter
            list.filter(function (item) {
                return item.values().categories.indexOf(selection) !== -1;
            });
        }
    }

    var onClickToggleTranscriptVisibility = function onClickToggleTranscriptVisibility() {
        var $buttonEl = $('.js-onClickToggleTranscriptVisibility');
        var $transcriptEl = $('.js-toggleTranscriptVisibility');

        if ($buttonEl.length) {
            $buttonEl.click(function () {
                $buttonEl.find('span').toggle();
                $transcriptEl.toggleClass('is-expanded is-collapsed');
            });
        }
    };

    $(document).ready(function () {

        initHeroCarousel();
        initLazyLoad();
        filterVideosByCategory();
        onClickToggleTranscriptVisibility();
    });
})();