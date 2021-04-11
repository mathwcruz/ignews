import { query as q } from "faunadb";
import NextAuth from 'next-auth'
import { session } from "next-auth/client";
import Providers from 'next-auth/providers'

import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: "read-user" //quais informações do usuário terá acesso
    }),
  ],
  callbacks: {
    async session(session) {
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index("subscription_by_user_ref"),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index("user_by_email"),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index("subscription_by_status"),
                "active"
              )
            ]),
          )
        );

        return {
          ...session,
          activeSubscription: userActiveSubscription,
        };
      } catch {
        return {
          ...session,
          activeSubscription: null,
        };
      };
    },
    async signIn(user, account, profile) {
      const { email } = user; //pegando o email do usuario do github

      try {
        await fauna.query( //salvando no banco o email do usuário
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create( //se o usuário ainda nao está cadastrado no banco, cria o usuário
              q.Collection('users'), //na coleção users
              { data: { email } } //salvando o e-mail
            ),
            q.Get(  //caso contrário, pega os dados do usuário que já existe e está tentando logar na aplicação
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        );

        return true;
      } catch (error) {
        return false; //nao deixa o usuario logar, caso dê algum ero
      }
    },
  }
});