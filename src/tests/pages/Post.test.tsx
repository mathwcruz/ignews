import { render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/utils";
import { getSession } from "next-auth/client";

import { getPrismicClient } from "../../services/prismic";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";

const post = { 
  slug: 'my-new-post', title: 'My New Post', content: '<p>Post content</p>', updatedAt: '25 de maio dd 2021' 
};
jest.mock('next-auth/client');
jest.mock('../../services/prismic');

describe("Post page", () => {
  it("renders correctlye", () => {
    render(<Post post={post} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });
  
  it("redirects user if no subscription is found", async() => {
    const getSessionMocked= mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: null,
    } as any);

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        }),
      }),
    );
  });

  it("loads initial data", async() => {
    const getSessionMocked= mocked(getSession);
    const getPrismicClientMocked = mocked(getPrismicClient);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription',
    } as any);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: 'heading', text: 'My New Post' }
          ],
          content: [
            { type: 'paragraph', text: 'Post excerpt' }
          ],
        },
        last_publication_date: '05-28-2021'
      }),
    } as any);

    const response = await getServerSideProps({ params: { slug: 'my-new-post' } } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: "My New Post",
            content: '<p>Post content</p>',
            updatedAt: '28 de maio de 2021',
          }
        },
      }),
    );
  });
});