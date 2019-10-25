/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($) {
    "use strict";

    var animEndEventNames = {
            'WebkitAnimation': 'webkitAnimationEnd',
            'OAnimation': 'oAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        animEndEventName = animEndEventNames[Modernizr.prefixed('animation')],
        onEndAnimation = function (el, callback) {
            var onEndCallbackFn = function (ev) {
                if (ev.target != this) {
                    return;
                }
                this.removeEventListener(animEndEventName, onEndCallbackFn);
                if (callback && typeof callback === 'function') {
                    callback.call();
                }
            };
            el.addEventListener(animEndEventName, onEndCallbackFn);
        };
    var $document = $(document),
        containers = [].slice.call($('.slide')),
        containersCount = containers.length,
        current = 0,
        isAnimating = false,
        pageTriggers = [];
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    $document.ready(function () {

        $('.menu-icon').on('click', function (e) {
            $('body').toggleClass('open');
            $(this).toggleClass('open');
        });

        $('pre code').each(function (i, block) {
            hljs.highlightBlock(block);
        });

        initSlider();

        bindScroll();

        redesignPagination();

        loadCover();

        lazyLoadDefault();

        addBanner();

        resetMobileFooter();

    });

    document.addEventListener('keydown', function (ev) {
        var keyCode = ev.keyCode || ev.which,
            isNavOpen = $('body').hasClass('open');

        switch (keyCode) {
            // left key
        case 37:
            if (current > 0 && !isNavOpen) {
                navigate(pageTriggers[current - 1]);
            }
            break;
            // right key
        case 39:
            if (current < containersCount - 1 && !isNavOpen) {
                navigate(pageTriggers[current + 1]);
            }
            break;
        }
    });

    function initSlider() {
        var thumbString = '';
        containers.forEach(function (item, index) {
            thumbString += '<a href="javascript:;" ' + (index === 0 ? 'class="active" ' : '') + '></a>';
        });
        if (containers.length > 1) {
            var ctrlString = '';
            if (!isMobile) {
                 ctrlString = '<div class="ctrl"><a href="javascript:;" class="js-ctrl-left" ><svg class="icon icon-chevron-left"><use xlink:href="#icon-chevron-left"></use></svg></a><a href="javascript:;" class="js-ctrl-right icon-angle-right" ><svg class="icon icon-chevron-right"><use xlink:href="#icon-chevron-right"></use></svg></a></div>';
            }
            $('#slideshow').append([ctrlString, '<div class="thumb">', thumbString, '</div>'].join(''));
            bindEvent();
        }
        pageTriggers = [].slice.call($('.thumb a'));
        $(containers[current]).addClass('slider--current');
        $('.slide').each(function (index, item) {
            var coverEl = $(item).find('.bg-overlay ');
            if (coverEl.hasClass('loaded')) {
                return;
            }
            var url = coverEl.attr('url');
            var img = new Image();
            img.src = url;
            img.onload = function() {
                coverEl.css({
                    'background-image': 'url(' + url + ')',
                });
                coverEl.addClass('loaded');
                if (index === 0) {
                    coverEl.parent().addClass('loaded');
                }
            }
        });
    }

    function bindEvent() {
        $('.js-ctrl-left').on('click', function () {
            if (current > 0) {
                navigate(pageTriggers[current - 1]);
            }
        });
        $('.js-ctrl-right').on('click', function () {
            if (current < containersCount - 1) {
                navigate(pageTriggers[current + 1]);
            }
        });

        if (isMobile) {
            $("#slideshow").swipe({
                //Generic swipe handler for all directions
                swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
                    if (direction == 'left') {
                        if (current < containersCount - 1) {
                            navigate(pageTriggers[current + 1]);
                        }
                    } else if (direction == 'right') {
                        if (current > 0) {
                            navigate(pageTriggers[current - 1]);
                        }
                    } else if (direction == 'down') {
                        var sT = $('html').scrollTop();
                        if(sT == 0) {
                            $('body').toggleClass('open');
                            $('.menu-icon').toggleClass('open');
                        } else {
                           $('html').animate({'scrollTop': 0},500);  
                        }

                    } else if(direction == 'up'){
                        return false;
                    }
                },
                threshold: 0,
                allowPageScroll: 'vertical',
            });
        }
    }

    function bindScroll() {
        var articleHeight = $('.js-article').height() - 80;
        var contentHeight = $('.content').height();
        var coverLoaded = false;
        $(document.body).on('scroll', function(e) {
            var top = e.target.scrollTop;
            var wH = window.innerHeight;
            var fixHeight = window.innerHeight + 70;
            if (!isMobile) {
                if ( top > fixHeight) {
                    $('.js-nav').addClass('fixed');
                } else if ($('.js-nav').hasClass('fixed')) {
                    $('.js-nav').removeClass('fixed');
                }
            }
            if (top > fixHeight) {
                $('.js-progress').css({
                    width: parseInt(((top - fixHeight) / articleHeight) * 100) + '%'
                });
            }
            var ratio = window.innerHeight / 900;
            if (top <= wH) {
                $('.overlay').css({
                    opacity: 0.2 + 0.8 * (top / wH),
                });
                $('.js-post-meta').css({
                    opacity: 1 - 0.8 * (top / wH),
                    transform: 'translateY(' + top / 3 + 'px)',
                });
                $('.js-post-cover').css({
                    backgroundPositionY: '-' + (top / 4) * ratio + 'px',
                });
            }
            var ratio = 1;
            if (isMobile) {
                ratio = 3;
            }
            if (top > (contentHeight - 700)) {
                $('.blur-circle.sm').css({
                   // opacity: 1 - 0.8 * (top / wH),
                    transform: 'translateY(' + (contentHeight - top - 700) / (2 * ratio)  + 'px)',
                });
                $('.blur-circle.md').css({
                    // opacity: 1 - 0.8 * (top / wH),
                     transform: 'translateY(' + (contentHeight - top - 700) / (3 * ratio) + 'px)',
                 });
                $('.blur-circle.lg').css({
                    // opacity: 1 - 0.8 * (top / wH),
                     transform: 'translateY(' + (contentHeight - top - 700) / (2 * ratio) + 'px)',
                 });
            }
            // the height of the fifth post
            if (top > 2000 && !coverLoaded) {
                lazyLoadOthers();
                coverLoaded = true;
            }

        });
    }

    function navigate(pageTrigger) {
        var oldcurrent = current,
            newcurrent = pageTriggers.indexOf(pageTrigger);
        if (isAnimating || oldcurrent === newcurrent) return;
        isAnimating = true;

        var currentPageTrigger = pageTriggers[current],
            nextContainer = containers[newcurrent],
            currentContainer = containers[current],
            dir = newcurrent > oldcurrent ? 'left' : 'right';

        $(currentPageTrigger).removeClass('active');
        $(pageTrigger).addClass('active');
        // update current
        current = newcurrent;
        $(nextContainer).addClass(dir === 'left' ? 'slider--animInRight' : 'slider--animInLeft');
        $(currentContainer).addClass(dir === 'left' ? 'slider--animOutLeft' : 'slider--animOutRight');
        onEndAnimation(currentContainer, function () {
            $(currentContainer).removeClass(dir === 'left' ? 'slider--animOutLeft' : 'slider--animOutRight');
            $(nextContainer).removeClass(dir === 'left' ? 'slider--animInRight' : 'slider--animInLeft');
            $(currentContainer).removeClass('slider--current');
            $(nextContainer).addClass('slider--current');
            isAnimating = false;
        });
    }

    var uniqueArray = function(arrArg) {
        return arrArg.filter(function(elem, pos,arr) {
          return arr.indexOf(elem) == pos;
        });
    };

    var buildUrl = function(page) {
        var path = location.pathname;
        if (path.indexOf('/page') > -1) {
            return path.split('/page')[0] + '/page/' + page;
        } else {
            return path + 'page/' + page;
        }
    }

    function redesignPagination() {
        var targetEl = $('nav.pagination');
        var prevIcon = '<svg class="icon icon-chevron-left"><use xlink:href="#icon-chevron-left"></use></svg>';
        var nextIcon = '<svg class="icon icon-chevron-right"><use xlink:href="#icon-chevron-right"></use></svg>';
        if (targetEl.length > 0) {
            var str = $('.page-number').text().trim();
            var current = str.split(' ')[1] * 1;
            var total = str.split(' ')[3] * 1;
            var arr = uniqueArray([1, 2, current, '...', total - 1, total]);
            var newHtml = '<div class="pagination-new">';
            if (current > 2) {
                newHtml += '<a class="pagi-prev" href="' + buildUrl(current - 1) + '">' + prevIcon + '</a>';
            }
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] === 'number' && arr[i] > 0) {
                    var url = buildUrl(arr[i]);
                    newHtml += '<a href="' + url + '"';
                    if (arr[i] === current) {
                        newHtml += ' class="active"';
                    }
                    newHtml += ' >' + arr[i] + '</a>';
                } else if (i === '...' && total > 4) {
                    newHtml += '<a disabled href="javascript:;">...</a>'
                }
            }
            if ( current < total - 1) {
                newHtml += '<a class="pagi-prev" href="' + buildUrl(current + 1) + '">' + nextIcon + '</a>';
            }
            newHtml += '</div>';
            targetEl.hide();
            if (total < 10) {
                return;
            }
            $('.js-pagination').append(newHtml);
        }
    }

    function loadCover() {
        var coverEl = $('.js-post-cover');
        var imgUrl = coverEl.attr('url');
        if (coverEl.length > 0 && coverEl.attr('url')) {
            var img = new Image();
            img.src = coverEl.attr('url');
            img.onload = function() {
                coverEl.css({
                    'background-image': 'url(' + imgUrl + ')',
                });
                coverEl.parent().addClass('loaded');
            }
        }
    }

    function loadPostCover (coverEl) {
        if (coverEl.hasClass('loaded')) {
            return;
        }
        var url = coverEl.attr('url');
        var img = new Image();
        img.src = url;
        img.onload = function() {
            coverEl.addClass('loaded');
            coverEl.prepend(img);
        }
    }

    function lazyLoadDefault() {
        $('.post').each(function(index, item) {
            if (index >= 4) {
                return;
            }
            var coverEl = $(item).find('.cover');
            loadPostCover(coverEl)
        });
    }
    function lazyLoadOthers() {
        $('.post').each(function(index, item) {
            if (index < 4) {
                return;
            }
            var coverEl = $(item).find('.cover');
            loadPostCover(coverEl)
        });
    }
    function addBanner() {
        var bannerEl = $('.post-banner');
        if (window.h5_config && h5_config.banner) {
            var config = h5_config.banner;
            bannerEl.addClass(config.class || 'sm');
            bannerEl.css({
                backgroundImage: 'url(' + (config.img) + ')',
            });
            bannerEl.find('.wrap').text(config.text || '')
        }
    }

    function resetMobileFooter (){
        if (isMobile) {
            var $firstItem = $('.link-wrap').children().first();
            $('.site-footer .link-wrap').append($firstItem);
        }
    }

})(jQuery);