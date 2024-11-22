import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom/client";
import "index.css";
import App from "App";
import reportWebVitals from "reportWebVitals";
import AuthGuard from "components/Auth/AuthGuard";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <AuthGuard>
            <App />
        </AuthGuard>
    </React.StrictMode>
);

reportWebVitals();
