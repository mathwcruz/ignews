import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { getStripeJs } from '../../services/stripe.js';
import { api } from "../../services/api.";

import styles from "./styles.module.scss";

export function SubscribeButton() {
  const [ session ] = useSession(); //verificando se o usuário está logado ou não
  const router = useRouter();

  async function handleSubscribe() {
    if (!session) {
      //caso o usuário náo esteja logado, irá redirecioná-lo para a página de login
      signIn("github");

      return;
    };

    if (session.activeSubscription) { //caso o usuário já tenha se cadastrado no blog, redireciona-o para os posts, para nao se cadastrar novamente
      router.push("/posts"); //redicreionanco o usuário para o Posts
      
      return;
    };

    //caso já esteja logado, cria a checkout session
    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data; //pegando o id do checkout no stripe

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    };
  };

  return (
    <button
      className={styles.subscribeButton}
      type="button"
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
};