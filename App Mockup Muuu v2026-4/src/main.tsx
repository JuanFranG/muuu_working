
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/App.tsx";
import "./styles/index.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? '';

// Solo envolver con GoogleOAuthProvider si el Client ID está configurado.
// Sin esto, el provider crashea con clientId vacío y deja la pantalla morada.
const root = <App />;

createRoot(document.getElementById("root")!).render(
  GOOGLE_CLIENT_ID
    ? <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{root}</GoogleOAuthProvider>
    : root
);