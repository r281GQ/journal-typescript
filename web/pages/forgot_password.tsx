import { useState } from "react";

import Layout from "../components/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword = () => {
  const [value, setValue] = useState("");

  const [handler, { called, error }] = useForgotPasswordMutation({
    variables: { forgotPasswordParams: { email: value } }
  });

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        {called && !error && <div>to reset your password see your inbox</div>}
        <label htmlFor="email">email</label>
        <input
          id="email"
          name="email"
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
        />
        <button
          onClick={() => {
            handler();
          }}
        >
          send forget password mail
        </button>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
