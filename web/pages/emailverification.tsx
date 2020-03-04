import * as React from "react";

import { ApolloClient, NormalizedCache } from "apollo-boost";
import Router from "next/router";
import { NextComponentType, NextPageContext } from "next";

import { VerifyEmailMutation, VerifyEmailDocument } from "../generated/graphql";

const EmailVerification: NextComponentType<NextPageContext & {
  apolloClient: ApolloClient<NormalizedCache>;
}> = () => {
  return <div>please verify your email</div>;
};

EmailVerification.getInitialProps = async ctx => {
  const token = ctx.query.token;

  if (token && typeof token === "string") {
    const result = await ctx.apolloClient.mutate<VerifyEmailMutation>({
      mutation: VerifyEmailDocument,

      variables: { token }
    });

    const serverResponse = ctx.res;

    if (serverResponse) {
      serverResponse.writeHead(303, { Location: "/" });
      serverResponse.end();
    } else {
      Router.replace("/");
    }

    return { result };
  }

  return {};
};

export default EmailVerification;
