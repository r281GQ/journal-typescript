import { useFormik } from "formik";

import { useCreateUserMutation } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

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
    <form onSubmit={handleSubmit}>
      <div>
        <input
          name="firstName"
          value={values.firstName}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          name="lastName"
          value={values.lastName}
          onChange={handleChange}
        />
      </div>
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
      <div>
        <label htmlFor="admin">admin</label>
        <input name="admin" type="checkbox" onChange={handleChange} />
      </div>
      <button type="submit">submit</button>
      {loading && <div>...</div>}
    </form>
  );
};

export default withApollo({ ssr: true })(Register);
