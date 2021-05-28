import { render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/utils";

import { stripe } from "../../services/stripe"
import Home, { getStaticProps } from "../../pages";

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return {
    useSession() {
      return [null, false];
    },
  };
});
jest.mock('../../services/stripe');

describe("Home page", () => {
  it("renders correctlye", () => {
    render(<Home product={{ priceId: 'fake-priceId', amount: 'R$12,00' }} />)

    expect(screen.getByText("for R$12,00 month")).toBeInTheDocument();
  });
  
  it("loads initial data", async() => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve);

    retrieveStripePricesMocked.mockResolvedValueOnce({ // sempre q a função retorna uma Promise, usa-se o método mockResolvedValueOnce()
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({ // valida se essas infos estão no response trazido pelo getStaticProps
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10,00',
          },
        },
      }),
    );
  });
});