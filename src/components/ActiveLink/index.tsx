import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { ReactElement, cloneElement } from "react";

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
};

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter(); //informa qual a rota que está sendo acessada no momento

  const className = asPath === rest.href //estilizando o item do menu de acordo com a rota q o usuário encontra-se
    ? activeClassName
    : ""

  return (
    <Link {...rest}>
     {cloneElement(children, { //cloneElement() usado para clonar um elemento e pode-se passar propriedades para esse elemento, usado quando queremos passar uma propriedade para o { children }
       className, //nesse caso, passando a propriedade className para estilizar o elemento
     })}
    </Link>
  );
};