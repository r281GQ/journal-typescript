import React from "react";

import { ApolloProvider } from "@apollo/react-hooks";
import { CacheProvider } from "@emotion/core";
import { cache } from "emotion";
import App from "next/app";

import { withApollo } from "../utils/withApollo";

/**
 * Sets up emotion and apollo with SSR.
 */
class MyApp extends App<any> {
  render() {
    const { apolloClient, Component, pageProps } = this.props;

    return (
      <CacheProvider value={cache}>
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </CacheProvider>
    );
  }
}

export default withApollo({ ssr: true })(MyApp);
