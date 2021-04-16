import { GetStaticProps } from 'next';
import Head from "next/head";

import { SubscribeButton } from "../components/SubscribeButton";

import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
};

export default function Home({ product }: HomeProps) { //deve-se ter o "export default" do componente
  return (
    <>
      <Head> {/* componente, vindo do Next, para especificar o título da página */}
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get acess to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl coding"/>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async() => { //nome da função SEMPRE deve ser esse, e SEMPRE deve ser uma função async
  //para usar a tática de SSR deve-se utilizá-la em uma página e não em um componente
  //servidor node.js que está rodando em paralelo com a apliação em React

  //Utilizar apenas o SSG, quando o conteúdo a ser mostrado é estático para todos q podem acessar aquela página. Caso contrário, se dependa de algum dado de um usuário em específico para renderizar em tela, aconselha-se usar o SSR

  /*
  Diferente maneiras de fazer uma chamada API com Next:
    Client-side (direto no componente, usando chamada http, useEffect e useState) - quando os dados trazidos pela API, não depende de indexação em motores de busca

    Server-side-rendering - quando o conteudo armazenado via API, dependa de algum dado do usuário em específico, varie de um para o outro.. informações em tempo real

    Static Site Generation - quando o conteudo armazenado via API, seja estático, igual para todos que estão acessando aquele dado
  */
  const price = await stripe.prices.retrieve('price_1IceL4L9xigmjmzSAcy3KesH');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price.unit_amount / 100),
  };

  return { //retornando a variavel produto que contem o id do preço e o preço unitario do produto
    props: {
      product
    },
    revalidate: 60 * 60 * 24 // = 24 horas //"revalidate" é quanto tempo, em SEGUNDOS, irá ficar ser renderizar novamente a página. Apenas irá devolver o conteudo html já salvo anteriormente
  };
};