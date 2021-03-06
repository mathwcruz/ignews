import { AppProps } from 'next/app';
import { Header } from '../components/Header';
import { Provider as NextAuthProvider } from 'next-auth/client';

import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextAuthProvider session={pageProps.session}> {/* contexto contendo a informação se o usuário está logado */}
      <Header />
      <Component {...pageProps} /> {/* renderiza o conteúdos das rotas conforme o usuário navega por elas */}
    </NextAuthProvider>
  );
};

export default MyApp;