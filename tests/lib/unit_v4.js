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
