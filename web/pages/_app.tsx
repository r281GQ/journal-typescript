import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import App from "next/app";

import { withApollo } from "../utils/withApollo";

class MyApp extends App<any> {
  render() {
    const { apolloClient, Component, pageProps } = this.props;

    return (
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApollo({ ssr: true })(MyApp);
