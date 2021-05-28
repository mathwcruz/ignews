import { render, screen } from "@testing-library/react"
import { mocked } from "ts-jest/utils";

import { getPrismicClient } from "../../services/prismic";
import Posts, { getStaticProps } from "../../pages/posts";

const posts = [
  { slug: 'my-new-post', title: 'My New Post', excerpt: 'Post excerpt', updatedAt: '25 de maio dd 2021' }
];

jest.mock('../../services/prismic');

describe("Posts page", () => {
  it("renders correctlye", () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText("My New Post")).toBeInTheDocument();
  });
  
  it("loads initial data", async() => {
    const getprismicClientMocked = mocked(getPrismicClient);

    getprismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My New Post' },
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' },
              ],
            },
            last_publication_date: '05-28-2021',
          },
        ],
      }),
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My New Post',
              excerpt: 'Post excerpt',
              updatedAt: '25 de maio dd 2021'
            },
          ],
        },
      }),
    );
  });
});