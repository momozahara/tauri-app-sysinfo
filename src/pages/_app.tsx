import type { AppProps } from "next/app";
import dynamic from "next/dynamic";

import "../App.css";

const TitleBar = dynamic(() => import("components/titlebar"), {
  ssr: false,
});

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <TitleBar>
        <Component {...pageProps} />
      </TitleBar>
    </>
  );
}
