import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "antd/dist/reset.css";
import { UserProvider } from "./context/UserContext.tsx";
import { NotificationProvider } from "./context/NotificationContext.tsx";

createRoot(document.getElementById("root")!).render(
  <NotificationProvider>
    <UserProvider>
      <App />
    </UserProvider>
  </NotificationProvider>
);
