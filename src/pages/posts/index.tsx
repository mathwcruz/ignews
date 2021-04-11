import { GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import Prismic from "@prismicio/client";
import { RichText } from "prismic-dom";

import { getPrismicClient } from "../../services/prismic";

import styles from "./styles.module.scss";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[]; //recebe um Array de objeto Post
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  //trazendo todos os posts do Prismic
  const response = await prismic.query(
    [Prismic.predicates.at("document.type", "publication")],
    {
      fetch: ["publication.title", "publication.content"],
      pageSize: 100,
    }
  );

  //sempre que der, formatar o dado antes de retornar esses dados para o front end

  console.log(JSON.stringify(response, null, 2)); // => dica para dar console.log mais formatado para leitura

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title), //pegando o título
      excerpt:
        post.data.content.find((content) => content.type === "paragraph")
          ?.text ?? "", //pegando o parágrafo do texto, caso seja encontrado
      updatedAt: new Date(post.last_publication_date).toLocaleDateString(
        "pt-BR",
        {
          //formatando a data conforme o layout da aplicação
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      ),
    };
  });

  return {
    props: {
      posts, //retornando o array contendo os posts
    },
  };
};
