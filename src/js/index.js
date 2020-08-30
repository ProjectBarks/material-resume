import '../sass/resume.scss';

import $ from 'jquery';
import 'materialize-css';

const ANIMATION_END = ['webkitTransitionEnd', 'otransitionend', 'oTransitionEnd', 'msTransitionEnd', 'transitionend'].join(' ');


$(document).ready(() => {
    ////////////////////////////////
    //     Side Bar Controls      //
    ////////////////////////////////
    const sideNav = $('#side-nav');
    const portraitWrapper = sideNav.find('.portrait-wrapper');


    sideNav.on(ANIMATION_END,
        () => {
            sideNav.removeClass('animate');
            sideNav.removeClass('animate-out');
        }
    );

    const scrollMode = {
        enabled: false,
        enable() {
            if ($(document).width() <= 600) 
                return;
            sideNav.addClass('animate');
            sideNav.addClass('mini');
            
            sideNav.removeClass('animate-out');
            
            scrollMode.checkMargins();
            scrollMode.enabled = true;
        },
        disable() {
            sideNav.addClass('animate');
            sideNav.removeClass('mini');

            if (scrollMode.enabled) 
                sideNav.addClass('animate-out');
            scrollMode.enabled = false;
        },
        checkMargins() {
            if ($(document).width() <= 600) 
                scrollMode.disable();
        },
        refresh() {
            const scroll = $(window).scrollTop();
            if(scroll >= portraitWrapper.offset().top) {
                scrollMode.enable();
            }
            if (scroll <= 5) {
                scrollMode.disable();
            }
        }
    };
    
    function checkSidebarHeight() {
        if ($(document).width() <= 600) {
            sideNav.css({height: ''});
        } else {
            const main = $('main');
            sideNav.css({height: `${main.height()}px`});
        }
    }

    $(window).resize(() => {
        checkSidebarHeight();
        if (!scrollMode.enabled) {
            return;
        }
        scrollMode.checkMargins();
    });

    document.addEventListener('scroll', scrollMode.refresh, { passive: true });
    //Set the sidebar height
    checkSidebarHeight();
    //Check if scrolling needs to be refreshed
    scrollMode.refresh();


    ////////////////////////////////
    //     Card Controls & Color  //
    ////////////////////////////////
    $('#projects').find('.card').each((i, elm) => {
        const card = $(elm);

        card.find('.activator').click(() => {
            const isOpen = card.hasClass('open');
            if (isOpen) {
                card.removeClass('open');
            } else {
                card.addClass('open');
                 $('html, body').animate(
                     { scrollTop: card.offset().top - ($(window).height() / 2) + (card[0].scrollHeight / 2) },
                     150
                 );                
            }
        });
    });

    ////////////////////////////////
    // Smooth Scrolling & Project //
    ////////////////////////////////
    $('a[href*=\'#\']:not([href=\'#\'])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            let target = $(this.hash);
            target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 250);

                if (target.parent().hasClass('card')) {
                    target.parent().find('.activator')[0].click();
                }
                return false;
            }
        }
    });

    // Automatically update year
    $('#end-date').text(Math.max(new Date().getFullYear(), 2016));


    ////////////////////////////////
    //         Show More          //
    ////////////////////////////////
    const SHOW_MORE = `
        <i class="material-icons right">arrow_drop_down</i>
        Show More`;
    const SHOW_LESS = `
        <i class="material-icons right">arrow_drop_up</i>
        Show LESS`;
    const row_groups = $('.row.experience').toArray().reduce((acc, x) => {
        const id = `${$(x).data('group')}`;
        const data = acc[id] || [];
        data.push($(x));
        acc[id] = data;
        return acc;
    }, {});
    delete row_groups['undefined'];
    for (const row_group of Object.values(row_groups)) {
        const hide_rows = row_group.slice(4, row_group.length);
        if (hide_rows.length <= 0)
            continue;
        hide_rows.forEach(x => x.addClass('hidden'));
        const [last_row] = hide_rows.slice(-1);
        const btn = $(`<a data-open="false" class="waves-effect waves-light btn primary-color show-more">${SHOW_MORE}</a>`)
           .insertAfter(last_row)
           .click(() => {
               if (btn.data('open')) {
                    btn.html(SHOW_MORE);
                    hide_rows.forEach(x => x.addClass('hidden'));
               } else {
                    btn.html(SHOW_LESS);
                    hide_rows.forEach(x => x.removeClass('hidden'));
               }
               btn.data('open', !btn.data('open'))
           });

    }
});