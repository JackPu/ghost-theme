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

        redesignPagination();


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
                 ctrlString = '<div class="ctrl"><a href="javascript:;" class="js-ctrl-left" ><svg class="icon icon-rewind"><use xlink:href="#icon-rewind"></use></svg></a><a href="javascript:;" class="js-ctrl-right icon-angle-right" ><svg class="icon icon-fast-forward"><use xlink:href="#icon-fast-forward"></use></svg></a></div>';
            }
            $('#slideshow').append([ctrlString, '<div class="thumb">', thumbString, '</div>'].join(''));
            bindEvent();
        }
        pageTriggers = [].slice.call($('.thumb a'));
        $(containers[current]).addClass('slider--current');
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
                newHtml += '<a class="pagi-prev" href="/page/"' + (current - 1) + '">' + prevIcon + '</a>';
            }
            for (var i = 0; i < arr.length; i++) {
                if (typeof arr[i] === 'number') {
                    var url = '/page/' + arr[i];
                    newHtml += '<a href="' + url + '"';
                    if (arr[i] === current) {
                        newHtml += ' class="active"';
                    }
                    newHtml += ' >' + arr[i] + '</a>';
                } else {
                    newHtml += '<a disabled href="javascript:;">...</a>'
                }
            }
            if ( current < total - 1) {
                newHtml += '<a class="pagi-prev" href="/page/"' + (current + 1) + '">' + nextIcon + '</a>';
            }
            newHtml += '</div>';
            targetEl.hide();
            $('.js-pagination').append(newHtml);
        }
    }


})(jQuery);