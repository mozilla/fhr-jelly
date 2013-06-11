window.onload = function() {

    function init() {
      window.addEventListener("message", receiveMessage, false);
      reqPayload();
    }

    function receiveMessage(event) {
        switch (event.data.type) {
        case "payload":
          payload = JSON.parse(event.data.content);
          document.querySelector("#raw pre").textContent = JSON.stringify(payload, null, 2);
          break;
        }
    }

    function reqPayload() {
      sendToBrowser("RequestCurrentPayload");
    }
    function sendToBrowser(type) {
      var event = new CustomEvent("RemoteHealthReportCommand", {detail: {command: type}});
      try {
        document.dispatchEvent(event);
      } catch(e) {
        console.log(e);
      }
    }

    init();
};
