/* globals
    test:false,
    equal: false,
    asyncTest: false,
    deepEqual: false,
    start: false,
    jQuery: true,
    isCurrentMonth: false,
 */

test('test-is-current-month-v4', 2, function() {
    var oldDate = '2012-06-13T00:00:00.0+02:00',
          today = new Date();

    equal(isCurrentMonth(oldDate), false, 'We were expecting false and got ' + isCurrentMonth(oldDate));
    equal(isCurrentMonth(today), true, 'We were expecting true and got ' + isCurrentMonth(today));
});

asyncTest('test-totals', function() {
    $.getJSON('/tests/json/multiple_sessions_v4.json', function(data) {
        var now = new Date(data.pings[0].creationDate);
        var accu = new MainPingAccumulator(now);
        for (var ping of data.pings) {
            accu.processPing(ping);
        }

        equal(accu.mainCrashesThisMonth, 1, 'Expected 1 main crash this month and got ' + accu.mainCrashesThisMonth);
        equal(accu.mainCrashes30Days, 2, 'Expected 2 main crashes in the last 30 days and got ' + accu.mainCrashes30Days);
        equal(accu.pluginCrashesThisMonth, 0, 'Expected 0 plugin crashes this month and got ' + accu.pluginCrashesThisMonth);

        equal(accu.totalSessionThisMonth, 2, 'Expected 2 sessions this month and got ' + accu.totalSessionThisMonth);
        equal(accu.totalTimeThisMonth, 60 * 60 * 10, 'Expected 10 hours session time this month and got ' + accu.totalTimeThisMonth / (60 * 60));

        start();
    });
});
