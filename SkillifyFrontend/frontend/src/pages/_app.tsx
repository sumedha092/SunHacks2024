// pages/_app.tsx
import "bootstrap/dist/css/bootstrap.min.css";
import "../app/globals.css"; // Import the global CSS file
import type { AppProps } from "next/app"; // Import AppProps type

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
