import * as React from "react";

import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextComponentType, NextPageContext } from "next";
import Router from "next/router";

import { MeDocument, MeQuery } from "../generated/graphql";

interface AuthHocOptions {
  withEmailVerification?: boolean;
}

const withAuth = (Component: NextComponentType, options?: AuthHocOptions) => {
  let optionsToUse: AuthHocOptions = {
    withEmailVerification: true
  };

  if (options) {
    optionsToUse = options;
  }

  const { withEmailVerification } = optionsToUse;

  const AuthenticationComponent: NextComponentType<NextPageContext & {
    apolloClient: ApolloClient<NormalizedCache>;
  }> = props => {
    return <Component {...props} />;
  };

  AuthenticationComponent.getInitialProps = async context => {
    let originalPageProps = {};

    try {
      if (Component.getInitialProps) {
        originalPageProps = await Component.getInitialProps(context);
      }

      const result = await context.apolloClient.query<MeQuery>({
        query: MeDocument
      });

      if (!result.data) {
        throw new Error("Not authorized");
      }

      if (withEmailVerification && result.data && !result.data.me.verified) {
        throw new Error("VERIFICATION");
      }

      return { ...originalPageProps };
    } catch (e) {
      const authorizationError = e.message.includes("Not authorized");

      const redirectUrl = authorizationError
        ? `/login?origin=${context.pathname}`
        : `/sendemail?origin=${context.pathname}`;

      if (context.res) {
        context.res.writeHead(303, {
          Location: redirectUrl
        });

        context.res.end();
      } else {
        Router.replace(redirectUrl);
      }

      return { ...originalPageProps };
    }
  };

  return AuthenticationComponent;
};

export default withAuth;
