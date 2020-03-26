import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextPageContext, NextComponentType, NextPage } from "next";

import { MeDocument, MeQuery } from "../generated/graphql";

function withAlreadyLoggedIn<P = {}>(
  Component: NextPage<{ alreadyLoggedIn: boolean } & P>
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
    let ctx = {};

    if (Component.getInitialProps) {
      ctx = await Component.getInitialProps(context);
    }

    let alreadyLoggedIn = false;

    try {
      const result = await context.apolloClient.query<MeQuery>({
        query: MeDocument
      });

      if (result.data.me) {
        alreadyLoggedIn = true;
      }
    } catch {}

    return { ...ctx, alreadyLoggedIn };
  };

  return ReturnComponent;
}

export default withAlreadyLoggedIn;
