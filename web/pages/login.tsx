import React from "react";

import { useFormik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import { useLoginMutation } from "../generated/graphql";
import { setAccessToken } from "../utils/accessToken";
import withAlreadyLoggedIn from "../utils/withAlreadyLoggedIn";
import useLogout from "../hooks/Logout";

const Login = withAlreadyLoggedIn(props => {
  const { alreadyLoggedIn } = props;

  const router = useRouter();
  const [handler, { loading }] = useLoginMutation();
  const [logout] = useLogout({ redirect: "/login" });

  const origin = router.query?.origin;

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
      } catch (e) {
        console.log(e);
      }
    }
  });

  if (alreadyLoggedIn) {
    return (
      <Layout>
        <div style={{ textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}>
            seems like you already have an account you logged in with
          </div>
          <div style={{ marginBottom: 16 }}>
            if you wish to create a new one and log out, click below
          </div>
          <div>
            <button onClick={logout}>logout</button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>log in</div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <label htmlFor="email">email</label>
          <input
            id="email"
            name="email"
            value={values.email}
            onChange={handleChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",

            alignItems: "center"
          }}
        >
          <label htmlFor="password">password</label>
          <input
            id="password"
            name="password"
            value={values.password}
            type="password"
            onChange={handleChange}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "16px 0"
          }}
        >
          <Link href="/forgot_password">
            <a href="/forgot_password">forgot password?</a>
          </Link>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button type="submit">submit</button>
        </div>
        {loading && <div>...</div>}
      </form>
    </Layout>
  );
});

export default Login;
