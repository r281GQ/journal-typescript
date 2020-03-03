import * as React from "react";

import Link from "next/link";

const Home = () => {
  const [value, handleChange] = React.useState("");

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/login">
          <div>Login</div>
        </Link>
        <Link href="/register">
          <div>Register</div>
        </Link>
        <Link href="/authcontent">
          <div>auth</div>
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          home route
          <input value={value} onChange={e => handleChange(e.target.value)} />
          <button
            onClick={() => {
              fetch(`http://localhost:3050/verify_email/${value}`, {
                method: "GET",
                credentials: "include"
              });
            }}
          >
            hit me
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
