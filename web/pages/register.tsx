import { useFormik } from "formik";
import { useRouter } from "next/router";

import Layout from "../components/Layout";
import { useCreateUserMutation } from "../generated/graphql";
import useLogout from "../hooks/Logout";
import { setAccessToken } from "../utils/accessToken";
import withAlreadyLoggedIn from "../utils/withAlreadyLoggedIn";

const Register = withAlreadyLoggedIn(props => {
  const { alreadyLoggedIn } = props;

  const [handler, { loading }] = useCreateUserMutation();

  const [logout] = useLogout({ redirect: "/register" });

  const { push } = useRouter();

  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      password: "",
      email: "",
      admin: false
    },
    onSubmit: async values => {
      try {
        const result = await handler({
          variables: {
            data: values
          }
        });

        const token = result.data?.createUser.token;

        if (token) {
          setAccessToken(token);

          push("/authcontent");
        }
      } catch {}
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
      <div style={{ textAlign: "center" }}>
        <div>sign up</div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              name="firstName"
              value={values.firstName}
              onChange={handleChange}
              placeholder="first name"
            />
          </div>
          <div>
            <input
              name="lastName"
              value={values.lastName}
              onChange={handleChange}
              placeholder="last name"
            />
          </div>
          <div>
            <input
              name="email"
              value={values.email}
              onChange={handleChange}
              placeholder="email"
            />
          </div>
          <div>
            <input
              name="password"
              value={values.password}
              type="password"
              onChange={handleChange}
              placeholder="password"
            />
          </div>
          <div>
            <label htmlFor="admin">admin</label>
            <input name="admin" type="checkbox" onChange={handleChange} />
          </div>
          <button type="submit">submit</button>
          {loading && <div>...</div>}
        </form>
      </div>
    </Layout>
  );
});

export default Register;
