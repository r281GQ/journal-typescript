import React from "react";

import { useFormik } from "formik";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import { useLoginMutation } from "../generated/graphql";
import { setAccessToken } from "../utils/accessToken";
import withAlreadyLoggedIn from "../utils/withAlreadyLoggedIn";

const Login = () => {
  const [handler, { loading }] = useLoginMutation();
  const router = useRouter();

  const origin = router.query.origin;

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      password: "",
      email: ""
    },
    onSubmit: async values => {
      try {
        const result = await handler({
          variables: {
            data: values
          }
        });

        if (result.data) {
          setAccessToken(result.data.login.token);
        }

        if (origin && typeof origin === "string") {
          router.push(origin);
        } else {
          router.push("/authcontent");
        }
      } catch {}
    }
  });

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center" }}>log in</div>
        <div>
          <input name="email" value={values.email} onChange={handleChange} />
        </div>
        <div>
          <input
            name="password"
            value={values.password}
            type="password"
            onChange={handleChange}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit">submit</button>
        </div>
        {loading && <div>...</div>}
      </form>
    </Layout>
  );
};

export default withAlreadyLoggedIn(Login);
