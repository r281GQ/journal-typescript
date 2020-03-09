import { useState } from "react";

import Layout from "../components/Layout";
import { useResetPasswordMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { query } = useRouter();

  const [handler] = useResetPasswordMutation();

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <label htmlFor="email">password</label>
        <input
          name="password"
          value={password}
          onChange={e => {
            setPassword(e.target.value);
          }}
        />
        <label htmlFor="email">confirm password</label>
        <input
          name="confirm password"
          value={confirmPassword}
          onChange={e => {
            setConfirmPassword(e.target.value);
          }}
        />
        <button
          onClick={async () => {
            if (query.token && typeof query.token === "string") {
              await handler({
                variables: {
                  resetPasswordParams: {
                    newPassword: confirmPassword,
                    token: query.token
                  }
                }
              });
            }
          }}
        >
          change password
        </button>
      </div>
    </Layout>
  );
};

export default ResetPassword;
