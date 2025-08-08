import '../styles/globals.css';
import type { AppProps } from 'next/app';

// Custom App component. This simply imports the global styles and
// renders the page component. Additional providers (e.g. for
// state management or theming) can be added here.
function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
