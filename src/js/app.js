"use strict";
$(document).ready(function () {

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
            sideNav.addClass("mini");
            scrollMode.checkMargins();
            scrollMode.enabled = true;
        },
        disable: function() {
            scrollMode.enabled = false;
            sideNav.removeClass("mini");
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
            sideNav.css({height: $("main").height() + "px"});
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
});