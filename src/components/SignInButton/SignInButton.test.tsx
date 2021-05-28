import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { useSession } from "next-auth/client";

import { SignInButton } from ".";

jest.mock('next-auth/client');

describe("SignInButton component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession); // criando uma variável para mockar o retorna do método useSession

    useSessionMocked.mockReturnValueOnce([null, false]); // mockando os dados retornados caso o usuário não esteja autenticado

    render(
      <SignInButton />
    );

    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([
      { user: { name: 'John Doe', email: 'john.doe@gmail.com' }, expires: 'fake-expires' },
      false]); // mockando os dados retornados caso o usuário esteja autenticado

    render(
      <SignInButton />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });
});
