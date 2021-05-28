import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Async } from ".";

it("renders correctly", async() => {
  render(<Async />);

  screen.logTestingPlaygroundURL(); // gera uma url que auxilia como encontrar tal elemento para realizar um teste

  expect(screen.getByText("Hello World")).toBeInTheDocument();

  await waitFor(() => { // irá executar até encontrar o que foi esperado
    return expect(screen.getByText("Button")).toBeInTheDocument();
  });

  // expect(await screen.findByText("Button")).toBeInTheDocument(); // findByText() espera algo aparecer em tela 

  await waitForElementToBeRemoved(screen.queryByText("Button")); // aguarda até q o elemento não mais em tela
});