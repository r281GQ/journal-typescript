import { render } from "@testing-library/react";
import { MockedProvider } from "@apollo/react-testing";

import { MeDocument } from "../generated/graphql";
import Login from "./../pages/login";

describe(Login, () => {
  it("test", () => {
    const result = render(
      <MockedProvider
        mocks={[
          {
            request: {
              query: MeDocument
            },
            result: {
              data: { me: { id: 9, email: "", verified: false } }
            }
          }
        ]}
      >
        <Login alreadyLoggedIn={false} />
      </MockedProvider>
    );
  });
});

export {};
