$(function() {
    // Hide the loading animation as soon as the DOM is ready.
    $('.loading').hide();

    var navListItems = $('.nav li');
    var navItems = navListItems.find('a');
    var contentContainers = $('.mainContent');

    var showContainer = function(anchor) {
        // Get the id of the container to show from the href.
        var containerId = anchor.attr('href');
        var container = $(containerId);
        container.show();
    };

    // Handle clicks on the main presistent header.
    navItems.click(function(event) {
        event.preventDefault();
        // Ensure all content containers are hidden.
        contentContainers.hide();
        // Remove the active class from all links.
        navItems.removeClass('active');
        // Set the clicked links to active.
        $(this).addClass('active');

        showContainer($(this));
    });

    // Show and hide the statistics for viewports less than 768px
    var showStatistics = $('#showstats');
    var statsBox = $('.statsBox');
    var statsBoxSection = $('.statsBoxSection');

    showStatistics.click(function(event) {
        event.preventDefault();

        statsBox.toggleClass('show');
        statsBoxSection.toggleClass('show');
    });

    // Tip Boxes
    // Handle close button clicks on tip boxes.
    $('.closeTip').mouseup(function() {
        var tipBox = $(this).parent();
        tipBox.hide('slow');
    });

    // Collapse and Expand Tip Box.
    $('.tipBox-header').click(function() {
        var tipboxContent = $(this).next('.tipBox-content');

        tipboxContent.toggleClass('collapse');
        $(this).find('.expanderArrow').toggleClass('collapse');
        tipboxContent.find('.buttonRow').toggleClass('collapse');
    });
});

// Paints the startup times onto the main graph.
// @param graphData an list of [[mssinceepoch, stime_ms]], for example:
//     [[1360108800000, 657], [1360108800000, 989]]

function drawGraph(startupTimes) {
    // This can be called before the page is ready, so wrap it in a ready
    // blocker.
    $(function() {
        $('.graphbox').show();
        var graphContainer = $('.graph');
        var currentLocale = $('html').attr('lang');

        // the default ticks can be pretty random: align them to day boundaries
        let min = Math.min.apply(null, [for (time of startupTimes) time[0]]);
        let max = Math.max.apply(null, [for (time of startupTimes) time[0]]);

        let minoffset = min % ONE_DAY;
        let timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        let ticks = [];
        let interval = ONE_DAY;
        if ((max - min) / interval > 20) {
            interval = ONE_DAY * 2;
        }

        for (let tick = min - minoffset + timezoneOffset;
             tick <= max; tick += interval) {
            ticks.push(tick);
        }

        // We need to localize our month names so first load our localized data,
        // then set the graph options and draw the graph.
        $.getJSON('js/locale/date_format.json', function(data) {
            var options = {
                colors: ['#50b432'],
                series: {
                    points: {
                        show: true,
                        radius: 2.5,
                    },
                },
                xaxis: {
                    min: min - ONE_DAY / 2,
                    max: max + ONE_DAY / 2,
                    mode: 'time',
                    timezone: 'browser',
                    timeformat: "%b %e",
                    ticks: ticks,
                    monthNames: data[currentLocale].monthNameShort.split(','),
                    show: true,
                }
            };

            // The startup times are in ms, we want to display seconds.
            let startupTimesSec = [for (t of startupTimes) [t[0], t[1] / 1000]];

            var graph = $.plot(graphContainer, [startupTimesSec], options);
            // We are drawing a graph so show the Y-label.
            $('.yaxis-label').show();
        }).fail(function(jqxhr, textStatus, error) {
            var errorTxt = textStatus + '[' + error + ']';
            graphContainer.text('The following error occurred while drawing the graph: ' + errorTxt);
        });
    });
}

    // Conditionally show tip boxes
    function showTipboxes(payload) {
        clearTimeout(waitr);

        // User has a crashy browser.
        if (getTotalNumberOfCrashes('week', 'main') > 2) {
            $('#crashyfox').show('slow');
        }

        // We need at least 5 sessions with data.
        if (getSessionsCount() < 5) {
            $('#hungryfox').show('slow');
        } else {
            // We have enough data, show the graph UI and draw the graph. By
            // default, we draw the average startup times.
            drawGraph(true);
        }
    }
