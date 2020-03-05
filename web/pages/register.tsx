import { useFormik } from "formik";

import Layout from "../components/Layout";
import { useCreateUserMutation } from "../generated/graphql";
import useLogout from "../hooks/Logout";
import withAlreadyLoggedIn, {
  AlreadyLoggedInComponent
} from "../utils/withAlreadyLoggedIn";

const Register: AlreadyLoggedInComponent = props => {
  const { alreadyLoggedIn } = props;

  const [handler, { loading }] = useCreateUserMutation();

  const [logout] = useLogout({ redirect: "/register" });

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
        await handler({
          variables: {
            data: values
          }
        });
      } catch {}
    }
  });

  if (alreadyLoggedIn) {
    return (
      <Layout>
        <div>
          <div> seems like you already have an account you logged in with</div>
          <div>if you wish to create a new one and log out, click below</div>
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
};

export default withAlreadyLoggedIn(Register);
