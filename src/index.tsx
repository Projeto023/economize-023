import * as ReactDOMClient from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./context/UserContext";

// Define your custom theme with the desired background color
const theme = createTheme({
  palette: {},
});

const root = ReactDOMClient.createRoot(document.getElementById("root")!);

root.render(
  <ThemeProvider theme={theme}>
    <GoogleOAuthProvider clientId="1060980321728-6pug209r5kbchm2nffvaunbq3uoluagb.apps.googleusercontent.com">
      <UserProvider>
        <BrowserRouter>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <App />
        </BrowserRouter>
      </UserProvider>
    </GoogleOAuthProvider>
  </ThemeProvider>
);
