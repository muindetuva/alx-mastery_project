import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
import { AuthProvider } from "./context/AuthContext";
import { reduxStore } from "./store/reduxStore";
import "./input.css";

document.documentElement.classList.toggle(
  "dark",
  localStorage.getItem("theme") === "dark",
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={reduxStore}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  </StrictMode>,
);
