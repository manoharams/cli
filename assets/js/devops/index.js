'use strict';

(function () {
    'use strict';

    var initStickyNav = function initStickyNav() {
        // find the stickyNav wrapper
        var $stickyNav = $('.js-initStickyNav');

        if ($stickyNav.length) {
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

    var initVerticalTabs = function initVerticalTabs() {
        var $tabs = $('.js-initVerticalTabs');
        var $tabsOnMobile = $('.js-initVerticalTabsOnMobile');
        var $tabsContent = $('.js-scrollToVerticalTabsContent');
        var hash = window.location.hash;

        if ($tabs.length) {

            if (hash) {
                // scroll to the tab content
                $('html, body').animate({
                    scrollTop: $tabsContent.offset().top - 90
                }, 1000);
                // show the appropriate tab
                $tabs.find('a[href="' + hash + '"]').tab('show');
                $tabsOnMobile.val(hash);
            }

            if ($tabsOnMobile.is(':visible')) {
                // initialize the select2 stuff only when mobile tabs are visible
                $tabsOnMobile.select2({
                    theme: 'vertical-tabs', // css customization stuff
                    minimumResultsForSearch: Infinity, // show everything, all the time
                    templateResult: function templateResult(data, container) {
                        if (data.element) {
                            // copy the color class utility from the <option> element
                            // to the list item
                            $(container).addClass($(data.element).attr('class'));
                        }
                        // gotta wrap the text in a <span> to make it white
                        // when selected; this is important, as the background-color
                        // for highlighted items is set to `currentColor`
                        return $('<span>' + data.text + '</span>');
                    }
                });
            }

            // when an option is selected, change the tab content
            $tabsOnMobile.on('change', function () {
                var id = $(this).val();
                $tabs.find('a[href="' + id + '"]').tab('show');
            });
        }
    };

    $(document).ready(function () {

        initStickyNav();
        initVerticalTabs();
    });
})();