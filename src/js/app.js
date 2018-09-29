$(document).ready(() => {
    ////////////////////////////////
    //        Introduction        //
    ////////////////////////////////
    function easyType(item, callback) {
        item.typed({
            strings: [item.attr("data")],
            showCursor: false,
            callback: callback || (() => {})
        })
    }

    function disableLoader() {
        const wrapper = $(".load-wrapper");
        $("html").removeClass("disable-scroll");
        wrapper.fadeOut(250, () => {
            wrapper.css({display: "none"});
        });
    }

    function textFromBackground(r, g, b) {

        // Counting the perceptive luminance
        // human eye favors green color...
        const a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return (a < 0.5) ? '#212121' : '#ffffff';
    }

    if (Cookies.get("visited") == null) {
        easyType($(".loader .prelabel"), () => {
            setTimeout(() => {
                const label = $(".loader .label");
                easyType(label, () => {
                    label.append("<span class='typed'></span>");
                    $(".typed").typed({
                        strings: $(".typed-strings span").map(function () {
                            return $(this).text()
                        }).toArray(),
                        backDelay: 500,
                        callback: disableLoader
                    });
                });
            }, 500);
        });
    } else {
        disableLoader();
    }

    Cookies.set("visited", "yes", { expires: 365, path: "/"});

    ////////////////////////////////
    //     Side Bar Controls      //
    ////////////////////////////////
    const sideNav = $("#side-nav");
    const portraitWrapper = sideNav.find(".portrait-wrapper");

    sideNav.on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
        () => {
            sideNav.removeClass("animate");
            sideNav.removeClass("animate-out");
        }
    );

    const scrollMode = {
        enabled: false,
        enable() {
            if ($(document).width() <= 600) 
                return;
            sideNav.addClass("animate");
            sideNav.addClass("mini");
            
            sideNav.removeClass("animate-out");
            
            scrollMode.checkMargins();
            scrollMode.enabled = true;
        },
        disable() {
            sideNav.addClass("animate");
            sideNav.removeClass("mini");

            if (scrollMode.enabled) 
                sideNav.addClass("animate-out");
            scrollMode.enabled = false;
        },
        checkMargins() {
            if ($(document).width() <= 600) {
                scrollMode.disable();
            }
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
            sideNav.css({height: ""});
        } else {
            const main = $("main");
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

    $(document).scroll(scrollMode.refresh);

    //Set the sidebar height
    checkSidebarHeight();
    //Check if scrolling needs to be refreshed
    scrollMode.refresh();


    ////////////////////////////////
    //     Card Controls & Color  //
    ////////////////////////////////
    let lastClicked = null;

    $("#projects").find(".card").each(function() {
        const card = $(this);

        card.find(".activator").click(() => {
            if (lastClicked != null) {
                lastClicked.find(".disabler").click();
            }
            lastClicked = card;
        });

        card.find(".disabler").click(() => {
            lastClicked.find(".waves-ripple").remove();
        });
    });

    ////////////////////////////////
    // Smooth Scrolling & Project //
    ////////////////////////////////
    $("a[href*=\"#\"]:not([href=\"#\"])").click(function() {
        if (location.pathname.replace(/^\//,"") == this.pathname.replace(/^\//,"") && location.hostname == this.hostname) {
            let target = $(this.hash);
            target = target.length ? target : $(`[name=${this.hash.slice(1)}]`);
            if (target.length) {
                $("html, body").animate({
                    scrollTop: target.offset().top
                }, 250);

                if (target.parent().hasClass("card")) {
                    target.parent().find(".activator")[0].click();
                }
                return false;
            }
        }
    });

    ////////////////////////////////
    //            Navbar          //
    ////////////////////////////////
    $(".button-collapse").sideNav();
});