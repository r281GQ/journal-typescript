import * as React from "react";

import { ApolloClient, NormalizedCache } from "apollo-boost";
import Router from "next/router";
import { NextComponentType, NextPageContext } from "next";

import {
  VerifyEmailMutation,
  VerifyEmailDocument,
  useSendMailMutation
} from "../generated/graphql";
import Layout from "../components/Layout";

const EmailVerification: NextComponentType<NextPageContext & {
  apolloClient: ApolloClient<NormalizedCache>;
}> = () => {
  const [handler, { loading, called, error }] = useSendMailMutation();
  return (
    <Layout>
      <div>Verifying your email was not successful.</div>
      <div>Click below to send another email.</div>
      <div>
        <button
          onClick={() => {
            handler();
          }}
        >
          send a new mail
        </button>
        {loading && <div>...</div>}
        {called && !loading && !error && (
          <div>done, please check your inbox</div>
        )}
      </div>
    </Layout>
  );
};

EmailVerification.getInitialProps = async ctx => {
  const token = ctx.query.token;

  if (token && typeof token === "string") {
    await ctx.apolloClient.mutate<VerifyEmailMutation>({
      mutation: VerifyEmailDocument,

      variables: { token }
    });

    const serverResponse = ctx.res;

    if (serverResponse) {
      serverResponse.writeHead(303, {
        Location: "/authcontent?event=verified"
      });
      serverResponse.end();
    } else {
      Router.replace("/authcontent?event=verified");
    }

    return {};
  }

  return {};
};

export default EmailVerification;
