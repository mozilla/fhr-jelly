/* globals
    test:false,
    equal: false,
    asyncTest: false,
    deepEqual: false,
    start: false,
    jQuery: true,
    isCurrentMonth: false,
    sortDates: false,
    getBookmarksTotal: false,
    getTotalNumberOfCrashes: false
 */

test('test-is-current-month', 2, function() {
    var oldDate = '2012-06-13',
          today = new Date();

    equal(isCurrentMonth(oldDate), false, 'We were expecting false and got ' + isCurrentMonth(oldDate));
    equal(isCurrentMonth(today), true, 'We were expecting true and got ' + isCurrentMonth(today));
});

asyncTest('test-sort-dates-ascending', function() {
    $.getJSON('/tests/json/multiple_sessions.json', function(payload) {
        var dates = sortDates(payload.data.days);
        deepEqual(
            dates,
            ['2013-02-01','2013-02-04','2013-02-06','2013-02-08','2013-02-13','2013-02-14','2013-03-05','2013-03-18','2013-03-21','2013-03-22','2013-03-23','2013-03-27','2013-03-28','2013-03-29','2013-03-31','2013-04-02'],
            'We expected the dates in an ascending order but got ' + dates
        );
        start();
    });
});

asyncTest('test-sort-dates-descending', function() {
    $.getJSON('/tests/json/multiple_sessions.json', function(payload) {
        var dates = sortDates(payload.data.days, true);
        deepEqual(
            dates,
            ['2013-04-02', '2013-03-31', '2013-03-29', '2013-03-28', '2013-03-27', '2013-03-23', '2013-03-22', '2013-03-21', '2013-03-18', '2013-03-05', '2013-02-14', '2013-02-13', '2013-02-08', '2013-02-06', '2013-02-04', '2013-02-01'],
            'We expected the dates in an descending order but got ' + dates
        );
        start();
    });
});

asyncTest('test-bookmarks', function() {
    $.getJSON('/tests/json/single_session.json', function(payload) {
        var bookmarksCount = getBookmarksTotal(payload.data.days);
        equal(bookmarksCount, 8, 'We were expecting 8 bookmarks and got ' + bookmarksCount);
        start();
    });
});

asyncTest('test-total-crashes', function() {
    $.getJSON('/tests/json/multiple_sessions.json', function(payload) {
        var totalNumberOfCrashes = getTotalNumberOfCrashes('all', 'main', payload);
        equal(totalNumberOfCrashes, 1, 'We were expecting a total of 1 crash(es) and got ' + totalNumberOfCrashes);
        start();
    });
});

asyncTest('test-total-crashes-for-current-month', function() {
    $.getJSON('/tests/json/multiple_sessions.json', function(payload) {
        var totalNumberOfCrashes = getTotalNumberOfCrashes('month', 'main', payload);
        equal(totalNumberOfCrashes, 0, 'We were expecting a total of 0 crash(es) for the current month and got ' + totalNumberOfCrashes);
        start();
    });
});
