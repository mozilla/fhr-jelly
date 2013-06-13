test('is-current-month', 2, function() {
    var oldDate = '2012-06-13',
          today = new Date();

    equal(isCurrentMonth(oldDate), false, 'We were expecting false and got ' + isCurrentMonth(oldDate));
    equal(isCurrentMonth(today), true, 'We were expecting true and got ' + isCurrentMonth(today));
});

asyncTest('bookmarks', function() {
    $.getJSON('/tests/json/single_session.json', function(payload) {
        var bookmarksCount = getBookmarksTotal(payload.data.days);
        equal(bookmarksCount, 8, 'We were expecting 8 bookmarks and got ' + bookmarksCount);
        start();
    });
});

asyncTest('total-crashes', function() {
    $.getJSON('/tests/json/multiple_sessions.json', function(payload) {
        var totalNumberOfCrashes = getTotalNumberOfCrashes('all', payload);
        equal(totalNumberOfCrashes, 1, 'We were expecting a total of 2 crash(es) and got ' + totalNumberOfCrashes);
        start();
    });
});

asyncTest('total-crashes-for-current-month', function() {
    $.getJSON('/tests/json/multiple_sessions.json', function(payload) {
        var totalNumberOfCrashes = getTotalNumberOfCrashes('month', payload);
        equal(totalNumberOfCrashes, 0, 'We were expecting a total of 0 crash(es) for the current month and got ' + totalNumberOfCrashes);
        start();
    });
});
