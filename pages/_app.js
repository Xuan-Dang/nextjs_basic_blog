import {AppProviders} from "@/context/AppProviders";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <AppProviders>
      <Component {...pageProps} />
    </AppProviders>
  );
}
