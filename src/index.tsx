import React from "react";
import ReactDOM from "react-dom/client";

import * as serviceWorkerRegistration from "@/serviceWorkerRegistration"
import { Provider } from "react-redux";

import App from "@/App";
import store from "@/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
setTimeout(() => {
  root.render(
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  );
}, 800);

// Keep auth screens and API integration fresh after deployments. An active
// service worker can keep serving a previous frontend bundle to users.
serviceWorkerRegistration.unregister();
