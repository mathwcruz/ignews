import { render, screen, fireEvent } from "@testing-library/react";
import { mocked } from "ts-jest/utils";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/router";

import { SubscribeButton } from ".";

jest.mock('next-auth/client');
jest.mock('next/router');

describe("SubscribeButton component", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockRejectedValueOnce([null, false] as never);

    render(
      <SubscribeButton />
    );

    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  it("redirects user to sign in when not authenticated", () => {
    const signInMocked = mocked(signIn); // mockando os dados do método signIn
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockRejectedValueOnce([null, false] as never);

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton); // "simulando" o comportamento de click do user

    expect(signInMocked).toHaveBeenCalled(); // espera-se que o método signIn seja chamado
  });

  it("redirects user to posts when user already has a subscription", () => {
    const useRouterMocked = mocked(useRouter); // mockando os dados do useRouter
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      { 
        user: { 
          name: 'John Doe', email: 'john.doe@gmail.com' 
        },
        activeSubscription:'fake-active-subscription', 
        expires: 'fake-expires' 
      },
      false,
    ]);

    useRouterMocked.mockRejectedValueOnce({
      push: pushMock,
    } as never); // mockando os dados do método push()

    render(
      <SubscribeButton />
    );

    const subscribeButton = screen.getByText("Subscribe now");

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts'); // espera-se que o método push tenha sido chamado
  });
});
