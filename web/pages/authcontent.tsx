import React from "react";
import Link from "next/link";

import { useUsersQuery } from "../generated/graphql";

const AuthContent = () => {
  const { data } = useUsersQuery();

  return (
    <>
      <Link href="/">
        <div>home</div>
      </Link>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh"
        }}
      >
        <div>{JSON.stringify(data)}</div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          auth content
        </div>
      </div>
    </>
  );
};

export default AuthContent;
