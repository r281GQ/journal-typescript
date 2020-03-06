import React from "react";

import Layout from "../components/Layout";
import { useUsersQuery } from "../generated/graphql";
import withAuth from "../utils/withAuth";
import { useRouter } from "next/router";

const AuthContent = () => {
  const { data } = useUsersQuery();

  const { query } = useRouter();

  const [emailVerified, setEmailVerified] = React.useState(() => {
    if (query.event && query.event === "verified") {
      return true;
    }

    return false;
  });

  return (
    <Layout>
      <div style={{ textAlign: "center" }}>
        <div style={{ marginBottom: 24 }}>
          this content requires authentication
        </div>
        {emailVerified && (
          <div style={{ marginBottom: 16 }}>
            <div>your email has been verified</div>
            <div>
              <button
                onClick={() => {
                  setEmailVerified(false);
                }}
              >
                dismiss
              </button>
            </div>
          </div>
        )}
        {data?.users.map(user => (
          <div key={user.id}> {`id: ${user.id}, email: ${user.email}`} </div>
        ))}
      </div>
    </Layout>
  );
};

export default withAuth(AuthContent, { withEmailVerification: false });
