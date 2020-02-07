import React from "react";
import Link from "next/link";

import LoginForm from "../components/LoginForm";
import { withApollo } from "../utils/withApollo";

const Login = () => {
  return (
    <div>
      <Link href="/">
        <div>home</div>
      </Link>
      <LoginForm />
    </div>
  );
};

export default withApollo({ ssr: true })(Login);
