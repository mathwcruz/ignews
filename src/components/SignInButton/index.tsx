import { FaGithub } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { signIn, signOut, useSession } from 'next-auth/client';

import styles from './styles.module.scss';

export function SignInButton() {
  const [session] = useSession(); //usuário está logado? "session"
  
  return session ? ( //o botão irá mudar caso o usuário esteja logado ou não
    <button 
      className={styles.signInButton} 
      type="button"
      onClick={() => signOut()} // irá deslogar o usuário
    >
      <FaGithub color="#04D361" />
      {session.user.name}
      <FiX className={styles.closeIcon} color="#737380" />
    </button>
  ) : (
    <button 
      className={styles.signInButton} 
      type="button"
      onClick={() => signIn('github')} //atutenticaçao com o github
    >
      <FaGithub color="#EBA417" />
      Sign in with GitHub
    </button>
  );
};