/*
 *  jQuery-mainNav - v1.0
 */

;(function ($, window, document, undefined) {

    // Plugin definition
    $.fn.mainNav = function (options) {

        // Default settings
        var settings = $.extend({}, $.fn.mainNav.settings, options);

        // Plugin code
        return this.each(function () {
            var $container = $(this); /* Navigation container: #mainNav-container */
            var $toggle = $container.find("#mainNav-toggle");
            var $mainNav = $container.find("#mainNav-menu");
            var $window = $(window);
            var $target;
            var isBreakpoint;


            settings.deployFrom = "mainNav-" + settings.deployFrom;
            $container.addClass(settings.deployFrom);
            $toggle.addClass(settings.deployFrom);
            breakpointChk();

            // Overlay
            if (settings.hasOverlay) {
                if ($('.mainNavOverlay').length == 0) {
                    $('#mainNav-container').append("<div class='mainNavOverlay'></div>");
                    $(".mainNavOverlay").css({
                        "top": "0",
                        "right": "0",
                        "bottom": "0",
                        "left": "0",
                        "position": "fixed",
                        "background-color": settings.overlayColor,
                        "opacity": settings.overlayOpacity,
                        "z-index": "-1  ",
                        "display": "none"
                    });
                }
            }

            // Sticky Nav
            if (settings.stickyNav) {
                var navPosition = $mainNav.offset().top;
                stickyNavChk(navPosition);
                $(window).scroll(function () {
                    stickyNavChk(navPosition);
                });
            }

            // Push Navigation
            if (settings.pushNav) {
                //$('body > *').not('#mainNav-container').wrapAll('<div class="push-mainNav-container"></div>')
                $('body').addClass('push-mainNav-container');
                $pushNav = $('.push-mainNav-container');
                $pushNav.addClass(settings.deployFrom);
                $('#mainNav-toggle, .mainNavOverlay').on('click', function () {
                    $pushNav.toggleClass('push-mainNav-open');
                    $('#mainNav-menu li').removeClass('mainNav-dropdown-open');
                });
            }

            // Toggle click event
            $('#mainNav-toggle, .mainNavOverlay').on('click', function () {
                $('#mainNav-toggle').stop().toggleClass('mainNav-open');
                $container.stop().toggleClass('mainNav-open');
                $('.mainNavOverlay').fadeToggle();
                
                if ( $('body').css("overflow") ) {
                    $('body, html').css("overflow", "");
                } else {
                    $('body, html').css("overflow", "hidden");
                }
            });

            // Mobile Dropdown
            setMobileDropdown();
            
            // OnResize Events
            var resizeTimer;
            $(window).resize(function () {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    breakpointChk();
                    if (isBreakpoint) {
                        $('body').css("margin-top", "0px");
                        if ($toggle.hasClass('mainNav-open')) {
                            $('.mainNavOverlay').css("display", "block");
                            $('body, html').css("overflow", "hidden");
                        }
                    } else {
                        $('.mainNavOverlay').css("display", "none");
                        navPosition = $mainNav.offset().top;
                        stickyNavChk(navPosition);
                        $('body, html').css("overflow", "");
                    }

                    setMobileDropdown();
                }, 500);
            });


            /** Functions **/

            // Checks screen size
            function breakpointChk() {
                if ($toggle.is(":visible")) {
                    isBreakpoint = true;
                } else {
                    isBreakpoint = false;
                }
            }
            
            // Checks whether sticky nav is set to true so it can be setup
            function stickyNavChk(navPosition) {
                if ($toggle.is(":hidden") && settings.stickyNav) {
                    if ($window.scrollTop() > navPosition) {
                        $container.addClass("mainNav-sticky");
                        // Add margin to the top of the body to avoid window "jumping"
                        $('body').css("margin-top", "20px");
                        // Wrap navigation into sticky container
                        if ($('.sticky-mainNav-container').length <= 0) {
                            $toggle.next().andSelf().wrapAll("<div class='sticky-mainNav-container'></div>");
                        }
                    } else {
                        if ($('.sticky-mainNav-container').length > 0) {
                            $('body').css("margin-top", "0");
                            $container.removeClass("mainNav-sticky");
                            $('.sticky-mainNav-container > *').unwrap();
                        }
                    }
                } else {
                    if ($window.scrollTop() == 0) {
                        $('body').css("margin-top", "0");
                        $container.removeClass("mainNav-sticky");
                        $('.sticky-mainNav-container > *').unwrap();
                    }
                }
            }
            
            // Sets mobile dropdown functionality
            function setMobileDropdown() {
                if ($toggle.is(":visible")) {
                    $('#mainNav-menu').has('ul').on('click', 'li, a', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        $target = $(e.target);
                        $this = $(this);
                        if ($target.is("a")) {
                            console.log("<a> clicked");
                            if ($this.parent().hasClass('mainNav-dropdown-open')) {
                                $this.parent().removeClass('mainNav-dropdown-open');
                            } else {
                                $this.parent().addClass('mainNav-dropdown-open');
                            }
                        } else {
                            console.log("<li> clicked");
                            if ($this.hasClass('mainNav-dropdown-open')) {
                                $this.removeClass('mainNav-dropdown-open');
                            } else {
                                if ($this.hasClass('mainNav-dropdown-open')) {
                                    $this.removeClass('mainNav-dropdown-open');
                                } else {
                                    // Open menu dropdown and close other open menu items 
                                    $('#mainNav-menu li').removeClass('mainNav-dropdown-open');
                                    $this.parent().parent().addClass('mainNav-dropdown-open');
                                    $this.addClass('mainNav-dropdown-open');
                                }
                            }
                        }
                    });

                }
            }
        });
    };

    // Default settings
    $.fn.mainNav.settings = {
        deployFrom: "left",  /* left || right || top */
        stickyNav: false,
        pushNav: false,
        hasOverlay: true,
        overlayColor: "#000",
        overlayOpacity: ".7"
    };

})(jQuery, window, document);