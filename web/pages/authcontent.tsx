import React from "react";
import Link from "next/link";

import { useUsersQuery } from "../generated/graphql";
import withAuth from "../utils/withAuth";

const AuthContent = () => {
  const { data } = useUsersQuery();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "30px 1fr",
        justifyItems: "center",
        alignItems: "center",
        minHeight: "100vh"
      }}
    >
      <Link href="/">
        <a href="/"> go back home</a>
      </Link>
      <div>
        <div>
          {data?.users.map(user => (
            <div key={user.id}> {`id: ${user.id}, email: ${user.email}`} </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(AuthContent, { withEmailVerification: false });
