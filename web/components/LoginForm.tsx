import * as React from "react";
import { useLoginMutation } from "../generated/graphql";

import { useFormik } from "formik";
import { setAccessToken, getAccessToken } from "../utils/accessToken";

const LoginForm = () => {
  const [handler, { loading }] = useLoginMutation();

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
      } catch {}
    }
  });

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">submit</button>
      {loading && <div>...</div>}
    </form>
  );
};

export default LoginForm;
