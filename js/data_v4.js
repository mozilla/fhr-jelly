var ONE_DAY = 1000 * 60 * 60 * 24;
var ONE_WEEK = ONE_DAY * 7;
var TWO_WEEKS = ONE_DAY * 14;
var THIRTY_DAYS_IN_SECONDS = 2592000;
var PAINT_TIME_THRESHOLD = 300000;
var CONFIG_URL = 'js/config.json?';
var prefs = null;

Promise.prototype.finally = function(fn) {
    return this.then(
        function(v) {
            fn();
            return v;
        },
        function(err) {
            fn();
            throw err;
        }
    );
};

var dateFormat = new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
function displayDate(timestamp) {
    return dateFormat.format(new Date(timestamp));
}

// Is this the first load for the document?
var isFirstLoad = true;

// Converts the date passed to a Date object and checks
// whether the current month is equal to the month of the
// day argument passed.
var isCurrentMonth = function(day, now) {
    if (!now) {
        now = new Date();
    }

    var currentYear = now.getYear();
    var currentMonth = now.getMonth() + 1;
    var year = new Date(day).getYear();
    var month = new Date(day).getMonth() + 1;

    if (currentYear === year && currentMonth === month) {
        return true;
    }
    return false;
};

function isPastNDays(day, n, now) {
    if (!now) {
        now = new Date();
    }

    var difference = now.getTime() - new Date(day).getTime();
    return difference < ONE_DAY * n;
}

function populateEnvironment(environment) {
    var vitalStatsValueContainers = $('#vital_stats .statsBoxSection-value');

    var channel = environment.settings.update.channel;
    var updates = "disabled";
    if (environment.settings.update.enabled) {
      updates = environment.settings.update.autoDownload ? "automatic" : "prompt";
    }
    var vitalStats = [
        environment.build.version,
        channel,
    ];

    vitalStatsValueContainers.not('#vital_stats-updates')
                             .each(function(index) {
        $(this).text(vitalStats[index]);
    });

    // We localize the update value via the page template and show/hide the relevant value here.
    for (var value of ["automatic", "prompt", "disabled"]) {
        var show = (value == updates);
        $('#vital_stats-updates-' + value).css('display', show ? 'inline':'none');
    }

    var addonsValueContainers = $('#addons .statsBoxSection-value');

    var activeAddons = 0;
    for (var id of Object.keys(environment.addons.activeAddons)) {
        ++activeAddons;
    }
    var activePlugins = 0;
    var clickPlugins = 0;
    for (var plugin of environment.addons.activePlugins) {
        if (plugin.clicktoplay) {
            ++clickPlugins;
        } else {
            ++activePlugins;
        }
    }
    activePlugins += Object.keys(environment.addons.activeGMPlugins).length;

    var addons = [
        activeAddons,
        activePlugins,
        clickPlugins,
    ];

    addonsValueContainers.each(function(index) {
        $(this).text(addons[index]);
    });
}

var pendingIDs = new Map();
function promiseFetchPing(id) {
    if (pendingIDs.has(id)) {
        var [p, res, rej] = pendingIDs.get(id);
        return p;
    }
    var evt = new CustomEvent('RemoteHealthReportCommand', {
        detail: {
            command: 'RequestTelemetryPingData',
            id: id,
        }
    });
    document.dispatchEvent(evt);
    var resolver, rejector;
    var promise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    }).finally(() => { pendingIDs.delete(id); });
    pendingIDs.set(id, [promise, resolver, rejector]);
    return promise;
}

var pendingCurrentSubsession = null;
function promiseFetchCurrentSubsession() {
    sendToBrowser("RequestCurrentPingData");
    return new Promise((resolve, reject) => {
        pendingCurrentSubsession = resolve;
    }).finally(() => { pendingCurrentSubsession = null; });
}

function pingReceived(id, data) {
    var [promise, resolve, reject] = pendingIDs.get(id);
    resolve(data);
}

function pingError(id, err) {
    var [promise, resolve, reject] = pendingIDs.get(id);
    reject(err);
}

function crashesFromMainPing(ping, type) {
    var base = ping.payload.keyedHistograms.SUBPROCESS_ABNORMAL_ABORT;
    if (base === undefined) {
        return 0;
    }
    var h = base[type];
    if (h === undefined || Object.keys(h).length === 0) {
        return 0;
    }
    return h.values[0];
}

function MainPingAccumulator(now) {
    this.totalSessionThisMonth = 0;
    this.totalTimeThisMonth = 0;
    this.mainCrashesThisMonth = 0;
    this.pluginCrashesThisMonth = 0;

    this.mainCrashes30Days = 0;

    this.startupTimes = [];

    this.now = now;
}
MainPingAccumulator.prototype = {
    processPing: function(data) {
        if (data.type == "main") {
            this.processMainPing(data);
        } else if (data.type == "crash") {
            this.processCrashPing(data);
        }
    },
    processMainPing: function(data) {
        if (isPastNDays(data.payload.info.subsessionStartDate, 30, this.now)) {
            if (data.payload.info.subsessionCounter == 1 &&
                data.payload.simpleMeasurements.firstPaint) {
                var sd = new Date(data.payload.info.subsessionStartDate).getTime();
                this.startupTimes.push([sd, data.payload.simpleMeasurements.firstPaint]);
            }
            this.mainCrashes30Days += crashesFromMainPing(data, "content");
        }
        if (isCurrentMonth(data.payload.info.subsessionStartDate, this.now)) {
            if (data.payload.info.subsessionCounter == 1) {
                ++this.totalSessionThisMonth;
            }
            this.totalTimeThisMonth += data.payload.info.subsessionLength;
            this.mainCrashesThisMonth += crashesFromMainPing(data, "content");
            this.pluginCrashesThisMonth += crashesFromMainPing(data, "plugin");
            this.pluginCrashesThisMonth += crashesFromMainPing(data, "gmplugin");
        }
    },

    processCrashPing: function(data) {
        if (isPastNDays(data.creationDate, 30, this.now)) {
            this.mainCrashes30Days += 1;
        }
        if (isCurrentMonth(data.creationDate, this.now)) {
            this.mainCrashesThisMonth += 1;
        }
    },
};

function populateThisMonth(pingList) {
    var now = new Date();
    var accu = new MainPingAccumulator(now);

    function finish() {
        var currentMonthValueContainers = $('#current_month .statsBoxSection-value');

        // TODO: localize properly (bug 1207111).
        var displayTime;
        if (accu.totalTimeThisMonth < 60 * 60) {
            displayTime = Math.floor(accu.totalTimeThisMonth / 60) + " minutes";
        } else if (accu.totalTimeThisMonth < 60 * 60 * 48) {
            displayTime = Math.floor(accu.totalTimeThisMonth / 60 / 60) + " hours";
        } else {
            displayTime = Math.floor(accu.totalTimeThisMonth / 60 / 60 / 24) + " days";
        }

        var thisMonth = [
            accu.totalSessionThisMonth,
            displayTime,
            accu.mainCrashesThisMonth,
            accu.pluginCrashesThisMonth,
        ];

        currentMonthValueContainers.each(function(index) {
            $(this).text(thisMonth[index]);
        });

        if (accu.mainCrashes30Days > 2) {
            $('#crashyfox').show('slow');
        }

        if (accu.startupTimes.length < 5) {
            $('#hungryfox').show('slow');
        } else {
            accu.startupTimes.sort((a, b) => (a[0] - b[0]));
            drawGraph(accu.startupTimes);
        }
    }

    var pending = 1;
    function pendingFinished() {
        if (--pending === 0) {
            finish();
        }
    }
    promiseFetchCurrentSubsession()
        .then(accu.processPing.bind(accu))
        .finally(pendingFinished);

    pingList.sort((a, b) => b.timestampCreated - a.timestampCreated);
    var linkList = document.getElementById('rawdata-list');
    for (var {type, timestampCreated, id} of pingList) {
        var link = document.createElement('a');
        link.setAttribute("data-id", id);
        link.textContent = displayDate(timestampCreated) + ": " + type;
        var line = document.createElement('li');
        line.appendChild(link);
        linkList.appendChild(line);

        if (!isPastNDays(timestampCreated, 35, now)) {
            continue;
        }
        ++pending;
        promiseFetchPing(id)
            .then(accu.processPing.bind(accu))
            .finally(pendingFinished);
    }

    $(document).on('click', '#rawdata-list a', function() {
        var id = this.getAttribute('data-id');
        promiseFetchPing(id).then((data) => {
            document.getElementById('rawdata-data').textContent =
                JSON.stringify(data, null, 2);
            $("#rawdata-list > .current").removeClass("current");
            $(this.parentElement).addClass("current");
        });
    });
}

function init() {
    var fhr = {};
    var cache_buster = Math.random();

    $.getJSON(CONFIG_URL + cache_buster, function(data) {
        fhr = data.fhr;
        if (fhr.debug == 'true') {
            var custom_event = {
                    data: {
                        type: 'payload',
                        content: ''
                    }
                };

            $.getJSON(fhr.jsonurl, function(data) {
                // receiveMessage expects a string.
                custom_event.data.content = JSON.stringify(data);
                receiveMessage(custom_event);
            });
        } else {
            window.addEventListener('message', receiveMessage, false);
            reqPrefs();
        }
    });
}

function receiveMessage(event) {
    // If this is the initial load of the page, we are only requesting prefs in
    // init and then only once the message for this is received do we ask for
    // the payload.
    if (isFirstLoad && event.data.type === 'prefs') {
        reqPayload();
        isFirstLoad = false;
    }

    // The below handles all other on demand requests for prefs or payloads.
    switch (event.data.type) {
    case 'prefs':
        prefs = event.data.content;
        if (prefs.enabled) {
            showStatusPanel($('.enabledPanel'), true, false);
        } else {
            showStatusPanel($('.disabledPanel'), false, false);
        }
        break;
    case 'telemetry-current-environment-data':
        populateEnvironment(event.data.content);
        break;
    case 'telemetry-ping-list':
        populateThisMonth(event.data.content);
        break;
    case 'telemetry-ping-data':
        if (event.data.content.pingData !== undefined) {
            pingReceived(event.data.content.id, event.data.content.pingData);
        } else {
            pingError(event.data.content.id, event.data.content.error);
        }
        break;
    case 'telemetry-current-ping-data':
        pendingCurrentSubsession(event.data.content);
        break;
    }
}

function disableSubmission() {
    sendToBrowser('DisableDataSubmission');
}

function enableSubmission() {
    sendToBrowser('EnableDataSubmission');
}

function reqPrefs() {
    sendToBrowser('RequestCurrentPrefs');
}

function reqPayload() {
    sendToBrowser('RequestCurrentEnvironment');
    sendToBrowser('RequestTelemetryPingList');
}

function sendToBrowser(type) {
    var event = new CustomEvent('RemoteHealthReportCommand', {
        detail: {
            command: type
        }
    });
    try {
        document.dispatchEvent(event);
    } catch (e) {
        console.log(e);
    }
}
