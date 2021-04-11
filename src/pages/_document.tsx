/* é carregado apenas uma vez com o next */
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  //esse componente em específico, para carregar a aplicação apenas uma vez, deve ser criado em formato de Class Component, extendendo a class Document do NextJS
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
          <link rel="shortcut icon" href="/favicon.png" type="image/png"/>
        </Head>
        <body>
          <Main /> {/* semelhante a div id="root" */}
          <NextScript /> {/* irá renderizar os scripts da aplicação */}
        </body>
      </Html>
    );
  };
};