import { render, screen } from "@testing-library/react";

import { ActiveLink } from ".";

// quando temos, em um componente, alguma funcionalidade externa àquele componente, por exemplo, métodos do React, do Next, etc, devemos mockar o retornos desses métodos, etc... para poder realizar o teste unitário do componente
jest.mock("next/router", () => {
  // toda vez q um componente importar o 'next/router', irá retornar os seguintes dados mockados
  return {
    // retorna um método que retorna um atributo 'asPath'
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("ActiveLink component", () => {
  it("renders correctly", () => { //pode-se usar test() também
    // nome do teste
    render(
      // método render irá renderizar um componente de maneira virtual
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toBeInTheDocument(); // espero q o texto 'Home' esteja na DOM, ao ser renderizado
  });

  it("adds active class if the link as currently active", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );

    expect(screen.getByText("Home")).toHaveClass("active");
  });
});
