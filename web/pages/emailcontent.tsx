import withAuth from "../utils/withAuth";
import Layout from "../components/Layout";

const EmailContent = () => {
  return (
    <Layout>
      <div>this page requires the email to be verified</div>
    </Layout>
  );
};

export default withAuth(EmailContent);
