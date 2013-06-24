window.onload = function() {

    var panels = $('.panel');

    function setActivePanel(panelId) {
        panels.each(function() {
            $(this).removeClass('active')
                      .addClass('inactive');
        });

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

    function init() {
      window.addEventListener('message', receiveMessage, false);
    }

    function receiveMessage(event) {
        switch (event.data.type) {
        case 'begin':
          // The wrapper page is ready to receive our messages.
          requestPrefs();
          requestPayload();
          break;

        case 'prefs':
          // Great. Eventually we'll show appropriate UI.
          break;

        case 'payload':
          payload = JSON.parse(event.data.content);
          document.querySelector('#raw pre').textContent = JSON.stringify(payload, null, 2);
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
