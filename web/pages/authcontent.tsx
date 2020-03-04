import React from "react";

import Layout from "../components/Layout";
import { useUsersQuery } from "../generated/graphql";
import withAuth from "../utils/withAuth";

const AuthContent = () => {
  const { data } = useUsersQuery();

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          this content requires authentication
        </div>
        {data?.users.map(user => (
          <div key={user.id}> {`id: ${user.id}, email: ${user.email}`} </div>
        ))}
      </div>
    </Layout>
  );
};

export default withAuth(AuthContent, { withEmailVerification: false });
