import { useEffect } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getSession, useSession } from "next-auth/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../../services/prismic";

import styles from "../post.module.scss";

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
};

export default function PostPreview({ post }: PostPreviewProps) {
  const [ session ] = useSession();
  const router = useRouter();

  useEffect(() => { //se o usuário estiver logado e com um assinatura ativa, ele será redirecionado ao post completo
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    };
  }, [session]);

  return (
    <>
    <Head>
      <title>{post.title} | Ignews</title>
    </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`} //recebendo duas estilizações
            dangerouslySetInnerHTML={{ __html: post.content }} 
          /> {/* evitar usar o dangerouslySetInnerHTML, somente quando o backend é bem seguro */}
          
          <div className={styles.continueReading}>
            Wanna continue reading?
             <Link href="/">
              <a>Subscribe now 🤗</a>
             </Link>
          </div>
        </article>
      </main>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [], //quais caminhos serão gerados durante a build, para já gerar o html estático
    fallback: "blocking"
  };
};

export const getStaticProps: GetStaticProps = async({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID("publication", String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title), //título do post
    content: RichText.asHtml(response.data.content.splice(0, 4)), //pegando apenas os 4 primeiros conteúdos do post
    updatedAt: new Date(response.last_publication_date).toLocaleDateString( //data de publicação do post
      "pt-BR",
      {
        //formatando a data conforme o layout da aplicação
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    ),
  };

  return {
    props: {
      post
    },
    revalidate: 60 * 30, // = 30 minutos
  };
};