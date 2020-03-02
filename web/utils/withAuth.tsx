import * as React from "react";
import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextComponentType, NextPageContext } from "next";
import Router from "next/router";

import { UsersQuery, UsersDocument } from "../generated/graphql";

const withAuth = (Component: React.ComponentType) => {
  const AuthenticationComponent: NextComponentType<
    NextPageContext & {
      apolloClient: ApolloClient<NormalizedCache>;
    },
    { authenticated: boolean },
    { authenticated: boolean }
  > = props => {
    return <Component {...props} />;
  };

  AuthenticationComponent.getInitialProps = async context => {
    try {
      const data = await context.apolloClient.query<UsersQuery>({
        query: UsersDocument
      });
      return { authenticated: data.errors?.length === 0 ? false : true };
    } catch {
      const serverResponse = context.res;

      if (serverResponse) {
        serverResponse.writeHead(303, { Location: "/" });
        serverResponse.end();
      } else {
        Router.replace("/");
      }

      return { authenticated: false };
    }
  };

  return AuthenticationComponent;
};

export default withAuth;
