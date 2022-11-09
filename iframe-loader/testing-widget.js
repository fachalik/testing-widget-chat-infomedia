/** @format */

function widgetApi() {
  return new Promise((resolve) => {
    let timeoutId;

    const getApi = () => {
      const event = new Event("getWidgetApi");
      timeoutId = window.setTimeout(getApi, 1000);
      window.dispatchEvent(event);
    };

    const onWidgetApi = (e) => {
      const api = e.detail;
      window.clearTimeout(timeoutId);
      resolve(api);
    };

    window.addEventListener("widgetApi", onWidgetApi, { once: true });
    getApi();
  });
}

// Handle Floating Button
(function () {
  const content = document.getElementById("message");
  const send = document.getElementById("send");
  const hide = document.getElementById("hide");
  const show = document.getElementById("show");
  const toggle = document.getElementById("toggle");

  const changeButtonsState = () => {
    show.disabled = !show.disabled;
    hide.disabled = !show.disabled;
  };

  widgetApi().then((api) => {
    hide.disabled = false;
    toggle.disabled = false;

    send.addEventListener("click", () => {
      const value = content.value;
      if (value.length > 0) {
        api.sendMessage(value);
        content.value = "";
      }
    });

    hide.addEventListener("click", () => {
      changeButtonsState();
      api.hide();
    });

    show.addEventListener("click", () => {
      changeButtonsState();
      api.show();
    });

    toggle.addEventListener("click", () => {
      changeButtonsState();
      api.toggle();
    });

    api.onHide = () => changeButtonsState();
  });
})();

// Handle Body Button
(() => {
  const script = document.currentScript;

  const loadWidget = () => {
    const widget = document.createElement("div");

    const widgetStyle = widget.style;
    widgetStyle.display = "none";
    widgetStyle.boxSizing = "border-box";

    widgetStyle.width = "212px";
    widgetStyle.height = "204px";
    widgetStyle.position = "fixed";
    widgetStyle.bottom = "5px";
    widgetStyle.right = "10px";
    widgetStyle.borderRadius = "15px";
    widgetStyle.zIndex = 99;

    const iframe = document.createElement("iframe");

    const iframeStyle = iframe.style;
    iframeStyle.boxSizing = "borderBox";
    iframeStyle.position = "absolute";
    iframeStyle.right = 0;
    iframeStyle.top = 0;
    iframeStyle.width = "100%";
    iframeStyle.height = "100%";
    iframeStyle.border = 0;
    iframeStyle.margin = 0;
    iframeStyle.padding = 0;

    widget.appendChild(iframe);

    const MainColor = script.getAttribute("main-color");

    const api = {
      sendMessage: (message) => {
        iframe.contentWindow.postMessage(
          {
            sendMessage: message,
          },
          "*"
        );
      },

      show: () => {
        if (
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/iPhone/i)
        ) {
          widgetStyle.width = "100%";
          widgetStyle.height = "100%";
          widgetStyle.bottom = "0px";
          widgetStyle.right = "0px";
        } else {
          widgetStyle.width = "400px";
          widgetStyle.height = "calc(100% - 100px)";
        }
        // widgetStyle.boxShadow = "-1px 0px 11px -2px rgba(0,0,0,0.81)";
        // widgetStyle.borderRadius = "15px";
      },

      hide: () => {
        widgetStyle.width = "212px";
        widgetStyle.height = "204px";
        widgetStyle.borderRadius = "15px";
        // widgetStyle.boxShadow = "";
        // widget.style.display = "none";
      },

      toggle: () => {
        const display = window.getComputedStyle(widget, null).display;
        widget.style.display = display === "none" ? "block" : "none";
      },

      onHide: () => {},
    };

    const widgetAddress = "https://widget-chat-infomedia.vercel.app";

    iframe.addEventListener("load", () => {
      window.addEventListener("getWidgetApi", () => {
        const event = new CustomEvent("widgetApi", { detail: api });
        window.dispatchEvent(event);
      });

      window.addEventListener("message", (evt) => {
        // console.log("MainColor", MainColor);
        // console.log("loader", evt);

        if (evt.origin !== widgetAddress) {
          return;
        }
        if (evt.data === "hide") {
          api.hide();
          api.onHide();
          // console.log('hit')
        }
        if (evt.data === "show") {
          api.show();
          // console.log('hot')
          // api.onHide();
        }
      });

      iframe.contentWindow.postMessage({ greeting: "test" }, widgetAddress);
      widgetStyle.display = "block";
    });

    const license = script.getAttribute("data-license");
    const PRIMARY_COLOR = "EB1C24";
    const SECONDARY_COLOR = "929497";
    const logo = "https://www.infomedia.co.id/chat/assets/img/header_logo.png";
    const postLoginToken = null;
    // const widgetUrl = `${widgetAddress}/?license=${license}&primaryColor=${PRIMARY_COLOR}&secondarColor=${SECONDARY_COLOR}`;
    const widgetUrl = `${widgetAddress}/?license=${license}&primaryColor=${PRIMARY_COLOR}&secondaryColor=${SECONDARY_COLOR}&logo=${logo}&postLoginToken=${postLoginToken}`;

    iframe.src = widgetUrl;
    iframe.allow = "geolocation";
    document.body.appendChild(widget);
  };

  if (document.readyState === "complete") {
    loadWidget();
  } else {
    document.addEventListener("readystatechange", () => {
      if (document.readyState === "complete") {
        loadWidget();
      }
    });
  }
})();
