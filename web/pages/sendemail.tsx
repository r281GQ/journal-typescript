import * as React from "react";

import { ApolloClient, NormalizedCache } from "apollo-boost";
import { NextComponentType, NextPageContext, NextPage } from "next";

import { useSendMailMutation, MeQuery, MeDocument } from "../generated/graphql";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import withAuth from "../utils/withAuth";

const SendEmail: NextComponentType<
  NextPageContext & {
    apolloClient: ApolloClient<NormalizedCache>;
  },
  { alreadyVerified: boolean },
  { alreadyVerified: boolean }
> = props => {
  const { alreadyVerified } = props;

  const [handler, { loading, called, error }] = useSendMailMutation();

  const { push } = useRouter();

  if (alreadyVerified) {
    return (
      <Layout>
        <div>Seems your email has been verified already.</div>
        <div>Click below to go to the home page</div>
        <div>
          <button
            onClick={() => {
              push("/");
            }}
          >
            go home
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>Before you can use that feature your email must be verified</div>
      <div>check your inbox, click on the link or</div>
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

SendEmail.getInitialProps = async ctx => {
  try {
    const result = await ctx.apolloClient.query<MeQuery>({
      query: MeDocument
    });

    if (result.data.me.verified) {
      return { alreadyVerified: true };
    }

    return { alreadyVerified: false };
  } catch {
    return { alreadyVerified: false };
  }
};

export default withAuth(SendEmail, { withEmailVerification: false });
