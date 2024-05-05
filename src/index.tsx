import * as ReactDOMClient from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// Define your custom theme with the desired background color
const theme = createTheme({
  palette: {},
});

const root = ReactDOMClient.createRoot(document.getElementById("root")!);

root.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <App />
    </BrowserRouter>
  </ThemeProvider>
);
