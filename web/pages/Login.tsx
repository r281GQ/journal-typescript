import React from "react";

import LoginForm from "../components/LoginForm";
import { withApollo } from "../utils/withApollo";

const Login = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default withApollo({ ssr: true })(Login);
