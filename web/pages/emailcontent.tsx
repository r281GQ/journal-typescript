import Layout from "../components/Layout";
import { useUsersQuery } from "../generated/graphql";
import withAuth from "../utils/withAuth";

const EmailContent = () => {
  const { data } = useUsersQuery();

  return (
    <Layout>
      <div style={{ marginBottom: 24 }}>
        this page requires the email to be verified
      </div>
      {data?.users.map(user => (
        <div key={user.id}> {`id: ${user.id}, email: ${user.email}`} </div>
      ))}
    </Layout>
  );
};

export default withAuth(EmailContent);
