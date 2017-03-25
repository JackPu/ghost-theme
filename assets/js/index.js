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
                return ;
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

    $document.ready(function () {

        $('.menu-icon').on('click', function (e) {
            $('body').toggleClass('open');
            $(this).toggleClass('open');
        });
        initSlider();



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
        containers.forEach(function(item, index) {
            thumbString += '<a href="javascript:;" ' + (index === 0? 'class="active" ': '')  + '></a>;'   
        });
        if(containers.length > 1) {
            var ctrlString = '<div class="ctrl"><a href="javascript:;" class="js-ctrl-left" ><svg class="icon icon-rewind"><use xlink:href="#icon-rewind"></use></svg></a><a href="javascript:;" class="js-ctrl-right icon-angle-right" ><svg class="icon icon-fast-forward"><use xlink:href="#icon-fast-forward"></use></svg></a></div>';
            $('#slideshow').append([ctrlString, '<div class="thumb">', thumbString, '</div>'].join(''));
            bindEvent();
        }
        pageTriggers = [].slice.call($('.thumb a'));
        classie.add( containers[ current ], 'slider--current' );
        
        
        
    }
    
    function bindEvent() {
        $('.js-ctrl-left').on('click', function() {
             if (current > 0) {
                navigate(pageTriggers[current - 1]);
            }    
        });
        $('.js-ctrl-right').on('click', function() {
             if (current < containersCount - 1) {
                navigate(pageTriggers[current + 1]);
            }
        })
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


})(jQuery);

