import "@/styles/globals.css";
import Head from 'next/head';
import Script from 'next/script'; // 引入Script组件

export default function App({ Component, pageProps }) {
  const handleBootstrapScriptLoad = () => {
    console.log('Bootstrap is loaded and ready to use!');
  };

  return (
    <>
      <Head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" 
          crossOrigin="anonymous"
        />
      </Head>
      <Script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" 
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" 
        crossOrigin="anonymous"
        strategy="afterInteractive"
        onLoad={handleBootstrapScriptLoad}
      />
      <Component {...pageProps} />
    </>
  );
}