import * as React from "react";
import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextComponentType } from "next";

import { UsersQuery, UsersDocument } from "../generated/graphql";

const withAuth = (Component: React.ComponentType) => {
  const AuthenticationComponent: NextComponentType<
    {
      apolloClient: ApolloClient<NormalizedCache>;
    },
    { authenticated: boolean },
    { authenticated: boolean }
  > = props => {
    if (props.authenticated) {
      return <Component {...props} />;
    }

    return <div>not authenticated</div>;
  };

  AuthenticationComponent.getInitialProps = async context => {
    try {
      const data = await context.apolloClient.query<UsersQuery>({
        query: UsersDocument
      });
      return { authenticated: data.errors?.length === 0 ? false : true };
    } catch {
      return { authenticated: false };
    }
  };

  return AuthenticationComponent;
};

export default withAuth;
