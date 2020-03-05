import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextPage, NextPageContext } from "next";

import { MeDocument, MeQuery } from "../generated/graphql";

export type AlreadyLoggedInComponent = React.ComponentType<{
  alreadyLoggedIn: boolean;
}>;

const withAlreadyLoggedIn = (
  Component: AlreadyLoggedInComponent
): NextPage<{ alreadyLoggedIn: boolean }> => {
  const ReturnComponent: NextPage<{ alreadyLoggedIn: boolean }> = props => {
    return <Component {...props} />;
  };

  ReturnComponent.getInitialProps = async (
    context: NextPageContext & { apolloClient: ApolloClient<NormalizedCache> }
  ) => {
    let alreadyLoggedIn = false;

    try {
      const result = await context.apolloClient.query<MeQuery>({
        query: MeDocument
      });

      if (result.data.me) {
        alreadyLoggedIn = true;
      }
    } catch {}

    return { alreadyLoggedIn };
  };

  return ReturnComponent;
};

export default withAlreadyLoggedIn;
