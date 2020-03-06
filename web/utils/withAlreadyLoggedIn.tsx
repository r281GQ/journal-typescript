import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextPageContext, NextComponentType } from "next";

import { MeDocument, MeQuery } from "../generated/graphql";

function withAlreadyLoggedIn<P = {}>(
  Component: React.ComponentType<{ alreadyLoggedIn: boolean } & P>
) {
  const ReturnComponent: NextComponentType<
    NextPageContext & { apolloClient: ApolloClient<NormalizedCache> },
    { alreadyLoggedIn: boolean },
    { alreadyLoggedIn: boolean } & P
  > = props => {
    return <Component {...props} alreadyLoggedIn={props.alreadyLoggedIn} />;
  };

  ReturnComponent.displayName = Component.displayName;

  ReturnComponent.getInitialProps = async context => {
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
}

export default withAlreadyLoggedIn;
