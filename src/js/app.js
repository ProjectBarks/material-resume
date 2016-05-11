"use strict";
$(document).ready(function () {
    ////////////////////////////////
    //        Introduction        //
    ////////////////////////////////
    function easyType(item, callback) {
        console.log(item, item.attr("data"));
        item.typed({
            strings: [item.attr("data")],
            showCursor: false,
            callback: callback || function () {}
        })
    }

    function disableLoader() {
        var wrapper = $(".load-wrapper");
        $("html").removeClass("disable-scroll");
        wrapper.fadeOut(250, function () {
            wrapper.css({display: "none"});
        });
    }

    if (Cookies.get("visited") == null) {
        easyType($(".loader .prelabel"), function () {
            setTimeout(function () {
                var label = $(".loader .label");
                easyType(label, function () {
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
    var sideNav = $("#side-nav");
    var mainPanel = $("#main-panel");
    var footer = $("footer");
    var portraitWrapper = sideNav.find(".portrait-wrapper");

    var scrollMode = {
        enabled: false,
        enable: function () {
            if ($(document).width() <= 600) {
                return;
            }
            sideNav.css({width: sideNav.width()});
            sideNav.addClass("mini");
            scrollMode.checkMargins();
            scrollMode.enabled = true;
        },
        disable: function() {
            scrollMode.enabled = false;
            sideNav.removeClass("mini");
            sideNav.css({width: ""});
            mainPanel.css({"margin-left": ""});
            footer.css({"margin-left": ""});
        },
        checkMargins: function() {
            if ($(document).width() <= 600) {
                scrollMode.disable();
            } else  {
                mainPanel.css({"margin-left": sideNav.width() + "px"});
                footer.css({"margin-left": sideNav.width() + "px"})
            }
        },
        refresh: function() {
            var scroll = $(window).scrollTop();
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
            var main = $("main");
            sideNav.css({height: main.height() + "px", width: main.width() - mainPanel.width()});
        }
    }

    $(window).resize(function () {
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
    //        Card Controls       //
    ////////////////////////////////
    var lastClicked = null;

    $("#projects").find(".card").each(function() {
        var card = $(this);

        card.find(".activator").click(function() {
            if (lastClicked != null) {
                lastClicked.find(".disabler").click();
            }
            lastClicked = card;
        });

        card.find(".disabler").click(function() {
            lastClicked.find(".waves-ripple").remove();
        });
    });

    ////////////////////////////////
    // Smooth Scrolling & Project //
    ////////////////////////////////
    $("a[href*=\"#\"]:not([href=\"#\"])").click(function() {
        if (location.pathname.replace(/^\//,"") == this.pathname.replace(/^\//,"") && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $("[name=" + this.hash.slice(1) +"]");
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