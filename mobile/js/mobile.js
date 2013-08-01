window.onload = function() {

    var panels = $('.panel'),
        payload = null,
        prefs = null,
        tips = document.querySelectorAll('li.enabled');

    // Tip Carousel
    // If we have more than one tip run the code,
    // else do nothing
    if(tips.length > 1) {
      var loopr = 0,
          counter = 0,
          tipsLength = tips.length;

      function showActiveTip(activeTip) {
          // hide all tips.
          for(tip in tips) {
              if(tips.hasOwnProperty(tip)) {
                  tips[tip].style.display = "none";
              }
          }
          // Make the current tip visible
          activeTip.style.display = "block";
      }

      (function rotateTips() {
          var currentTip = counter < tipsLength ? counter : counter = 0;

          showActiveTip(tips[counter]);
          counter += 1;

          loopr = setTimeout(rotateTips, 5000);
      })();
    }

    // As we navigate between panels, for panels local to
    // the health report, we manage history using URL
    // hashes and listening for hashchanges.
    window.addEventListener('hashchange', function() {
        setActivePanel(window.location.hash);
    });

    function setActivePanel(panelId) {
        panels.each(function() {
            $(this).removeClass('active')
                   .addClass('inactive');
        });

        // Add panelId as hash to URL, this ensures we have
        // history entries to navigate between the local panels.
        window.location.hash = panelId;
        $(panelId).addClass('active');
    }

    $(document).on('click', 'a.navigate', function(event) {
        event.preventDefault();
        setActivePanel($(this).attr('href'));
    });

    $("#showsettings").on('click', function(event) {
        event.preventDefault();
        showSettings();
    });

    function populateData(data) {
        var sysInfo = data.environments.current['org.mozilla.sysinfo.sysinfo'],
              geckoAppInfo = data.environments.current['geckoAppInfo'],
              appInfo = data.environments.current['org.mozilla.appInfo.appinfo'],
              addonsCount = data.environments.current['org.mozilla.addons.counts'];

        $('#cpu_count > span').text(sysInfo.cpuCount);
        $('#memory > span').text(sysInfo.memoryMB + ' MB');
        $('#app_name > span').text(geckoAppInfo.name);
        $('#app_id > span').text(geckoAppInfo.id);
        $('#app_version > span').text(geckoAppInfo.version);
        $('#build_id > span').text(geckoAppInfo.appBuildID);
        $('#update_channel > span').text(geckoAppInfo.updateChannel);
        $('#vendor > span').text(geckoAppInfo.vendor);
        $('#platform > span').text(geckoAppInfo.platformVersion);
        $('#platform_build_id > span').text(geckoAppInfo.platformBuildID);
        $('#xpcomabi > span').text(geckoAppInfo.xpcomabi);
        $('#environment > span').text(sysInfo.architecture);
        $('#android_version > span').text(sysInfo.version);
        $('#telemetry > span').text(appInfo.isTelemetryEnabled === 1 ? 'true' : 'false');
        $('#extension_count > span').text(addonsCount.extension);
        $('#plugin_count > span').text(addonsCount.plugin);
        $('#themes > span').text(addonsCount.theme);
    }

    function init() {
      window.addEventListener('message', receiveMessage, false);
    }

    function receiveMessage(event) {
        var enabled = $('#enabled'),
              disabled = $('#disabled');

        switch (event.data.type) {
        case 'begin':
          // The wrapper page is ready to receive our messages.
          requestPrefs();
          requestPayload();
          break;

        case 'prefs':
          prefs = event.data.content;

          // Toggle footer message based on prefs state
          if(prefs.enabled) {
              enabled.show();
              disabled.hide();
          } else {
              disabled.show();
              enabled.hide();
          }
          break;

        case 'payload':
          payload = JSON.parse(event.data.content);
          document.querySelector('#raw pre').textContent = JSON.stringify(payload, null, 2);
          populateData(payload);
          break;
        }
    }

    function requestPrefs() {
      sendToBrowser('RequestCurrentPrefs');
    }

    function requestPayload() {
      sendToBrowser('RequestCurrentPayload');
    }

    function showSettings() {
      sendToBrowser('ShowSettings');
    }

    function sendToBrowser(type) {
      try {
        let event = new CustomEvent('RemoteHealthReportCommand', {detail: {command: type}});
        document.dispatchEvent(event);
      } catch(e) {
        console.log('Caught exception: ' + e);
      }
    }

    init();
};
