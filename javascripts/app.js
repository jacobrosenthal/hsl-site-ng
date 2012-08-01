jQuery(document).ready(function ($) {

    var flickrImages = [];
    var flickrLimit = 20;
    var previousIdx = 9999;
    var timeout = {};

    var feedurls = [
        "http://blag.meznak.net/atom.xml",
        "http://rix.si/atom.xml",
        "http://citizengadget.com/rss",
        "http://fab.heatsynclabs.org/rss",
        "http://hsl-sem.tumblr.com/rss",
        "http://www.blogger.com/feeds/8608412012855561239/posts/default",
        "http://www.makermaximum.com/atom.xml",
        "http://feeds.feedburner.com/teamdroid/RSS",
        "http://www.toddfun.com/feed/",
        "http://willbradley.name/feed/"
    ];

    var feedcontainer = document.getElementById("feed");
    var entries = [];

    var compareEntries = function(A, B) {
        return A.date.getTime() < B.date.getTime() ? 1 : -1;
        //return Date.parse(A.publishedDate) < Date.parse(B.publishedDate);
    }

    var entryDone = function(entry) {
        entries.push(entry);
    }

    var feedImgs = {};
    var feedLoaded = {};

    var imgCheck = function() {
        if (this.width>10 && this.height>10) {
            feedImgs[this.feedlink].push(this);
        } else {
        }
    }

    var feedDone = function(loaded,feed) {
        feedcontainer.innerHTML = "<h4>feeds loading ... " + (loaded/feedurls.length)*100 + "%</h4>";
        feedImgs[feed.link] = [];
        feedLoaded[feed.link] = true;

        for (var i=0; i<feed.entries.length; i++) {
            var entry = feed.entries[i];
            for (var j=0; j<entry.imgs.length; j++) {
                var img = document.createElement('img');
                img.src=entry.imgs[j];
                img.feedlink=feed.link;
                img.onload = imgCheck;
            }
        }
        feedLoaded[feed.feedurl] = true;
    }

    var finishedEntries = function() {
        entries.sort(compareEntries);
        feedcontainer.innerHTML="<h2>Feeds:</h2>";
        for (var i=0; i<entries.length; i++) {
            var entry = entries[i];
            var div = document.createElement("div");
            div.innerHTML = "<div style='" + (entry.imgs.length?"background:url("+entry.imgs[0]+");":"") +
                "margin-top:1em;height:10em;width:60em;z-index:-1;position:absolute;left:5em;background-repeat:no-repeat;'></div>" +
                "<div class='feedr"+i%2+"' style='min-height:11em;margin-bottom:1em;padding-bottom:0'>" +
                "<h3><a href='"+entry.link+"'>"+(entry.title?entry.title:entry.blogurl)+"</a></h3>"+
                "<h4>"+(entry.author?" by "+entry.author:"")+" on "+entry.date.toLocaleDateString()+"</h4>"+
                "<p>"+entry.intro+"... (<a href='"+entry.link+"'>more</a>)</p>" +
                "</div>";
            feedcontainer.appendChild(div);
        }
    }


    /* ----------------------------------------------------------------------
     * Flickr image magick
     * ----------------------------------------------------------------------*/
    $(document).ready(function() {

        // Prevent .main-image-div from getting the child divs' onclicks
        $(".content").click(function(e) {
            e.stopPropagation();
        })

        // this function sticks a random image from flickrImages[] in to the
        // background of .main-image-div and causes a JS link to the image's
        // flickrpage
        newImage = function() {
            var num=0;
            while (flickrImages.length>1 && ((num=Math.floor(Math.random()*flickrImages.length)) == previousIdx)) {}
            previousIdx = num;
            $('.main-image-div').css("background", "url("+flickrImages[num].image_b+") no-repeat 50%");
            $('.float').html("<h4>"+flickrImages[num].title+"</h4>");
            $('.main-image-div').click( function() {
                window.location = flickrImages[num].link;
            });
        };

        // Do the jquery flick goodness
        $.jflickrfeed(
            {
                limit: flickrLimit,
                qstrings: {
                    tags: 'publish',
                    id: '60827818@N07'
                },
                useTemplate: false,
                itemCallback: function(item){
                    flickrImages.push(item);
                }
            },
            function(){
                //newImage();
                //timeout = setInterval(newImage, 10000)
                initialize(flickrImages);
            });

        var feed = new feedr(feedurls,20,entryDone,feedDone,finishedEntries);
    });

    /* TABS --------------------------------- */
    /* Remove if you don't need :) */

    function activateTab($tab) {
        var $activeTab = $tab.closest('dl').find('dd.active'),
        contentLocation = $tab.children('a').attr("href") + 'Tab';

        // Strip off the current url that IE adds
        contentLocation = contentLocation.replace(/^.+#/, '#');

        // Strip off the current url that IE adds
        contentLocation = contentLocation.replace(/^.+#/, '#');

        //Make Tab Active
        $activeTab.removeClass('active');
        $tab.addClass('active');

        //Show Tab Content
        $(contentLocation).closest('.tabs-content').children('li').hide();
        $(contentLocation).css('display', 'block');
    }

    $('dl.tabs dd a').on('click.fndtn', function (event) {
        activateTab($(this).parent('dd'));
    });

    if (window.location.hash) {
        activateTab($('a[href="' + window.location.hash + '"]'));
        $.foundation.customForms.appendCustomMarkup();
    }

    /* ALERT BOXES ------------ */
    $(".alert-box").delegate("a.close", "click", function(event) {
        event.preventDefault();
        $(this).closest(".alert-box").fadeOut(function(event){
            $(this).remove();
        });
    });

    /* PLACEHOLDER FOR FORMS ------------- */
    /* Remove this and jquery.placeholder.min.js if you don't need :) */
    $('input, textarea').placeholder();

    /* TOOLTIPS ------------ */
    $(this).tooltips();

    /* UNCOMMENT THE LINE YOU WANT BELOW IF YOU WANT IE6/7/8 SUPPORT AND ARE USING .block-grids */
    //  $('.block-grid.two-up>li:nth-child(2n+1)').css({clear: 'left'});
    //  $('.block-grid.three-up>li:nth-child(3n+1)').css({clear: 'left'});
    //  $('.block-grid.four-up>li:nth-child(4n+1)').css({clear: 'left'});
    //  $('.block-grid.five-up>li:nth-child(5n+1)').css({clear: 'left'});


    /* DROPDOWN NAV ------------- */

    var lockNavBar = false;
    /* Windows Phone, sadly, does not register touch events :( */
    if (Modernizr.touch || navigator.userAgent.match(/Windows Phone/i)) {
        $('.nav-bar a.flyout-toggle').on('click.fndtn touchstart.fndtn', function(e) {
            e.preventDefault();
            var flyout = $(this).siblings('.flyout').first();
            if (lockNavBar === false) {
                $('.nav-bar .flyout').not(flyout).slideUp(500);
                flyout.slideToggle(500, function(){
                    lockNavBar = false;
                });
            }
            lockNavBar = true;
        });
        $('.nav-bar>li.has-flyout').addClass('is-touch');
    } else {
        $('.nav-bar>li.has-flyout').hover(function() {
            $(this).children('.flyout').show();
        }, function() {
            $(this).children('.flyout').hide();
        });
    }

    /* DISABLED BUTTONS ------------- */
    /* Gives elements with a class of 'disabled' a return: false; */

    /* SPLIT BUTTONS/DROPDOWNS */
    $('.button.dropdown > ul').addClass('no-hover');

    $('.button.dropdown').on('click.fndtn touchstart.fndtn', function (e) {
        e.stopPropagation();
    });
    $('.button.dropdown.split span').on('click.fndtn touchstart.fndtn', function (e) {
        e.preventDefault();
        $('.button.dropdown').not($(this).parent()).children('ul').removeClass('show-dropdown');
        $(this).siblings('ul').toggleClass('show-dropdown');
    });
    $('.button.dropdown').not('.split').on('click.fndtn touchstart.fndtn', function (e) {
        e.preventDefault();
        $('.button.dropdown').not(this).children('ul').removeClass('show-dropdown');
        $(this).children('ul').toggleClass('show-dropdown');
    });
    $('body, html').on('click.fndtn touchstart.fndtn', function () {
        $('.button.dropdown ul').removeClass('show-dropdown');
    });

    // Positioning the Flyout List
    var normalButtonHeight  = $('.button.dropdown:not(.large):not(.small):not(.tiny)').outerHeight() - 1,
    largeButtonHeight   = $('.button.large.dropdown').outerHeight() - 1,
    smallButtonHeight   = $('.button.small.dropdown').outerHeight() - 1,
    tinyButtonHeight    = $('.button.tiny.dropdown').outerHeight() - 1;

    $('.button.dropdown:not(.large):not(.small):not(.tiny) > ul').css('top', normalButtonHeight);
    $('.button.dropdown.large > ul').css('top', largeButtonHeight);
    $('.button.dropdown.small > ul').css('top', smallButtonHeight);
    $('.button.dropdown.tiny > ul').css('top', tinyButtonHeight);

});
