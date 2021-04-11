import { Client } from 'faunadb';

//acesso ao banco de dados
export const fauna = new Client({ 
  secret: process.env.FAUNADB_KEY,
});