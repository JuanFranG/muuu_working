
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./app/App.tsx";
import "./styles/index.css";

// El Client ID de Google es público (se expone en el frontend siempre).
// La seguridad viene de los orígenes autorizados configurados en Google Cloud Console.
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '711512277666-2peisghj20i5u9mr37brlnjprjhp2a8v.apps.googleusercontent.com';

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);