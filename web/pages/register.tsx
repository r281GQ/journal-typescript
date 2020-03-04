import { useFormik } from "formik";

import Layout from "../components/Layout";
import { useCreateUserMutation } from "../generated/graphql";

const Register = () => {
  const [handler, { loading }] = useCreateUserMutation();

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

export default Register;
