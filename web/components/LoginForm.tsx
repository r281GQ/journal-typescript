import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

interface TempUser {
  users: [{ id: number }];
}

const LoginForm: React.FC = ({}) => {
  const { data, loading } = useQuery<TempUser>(
    gql`
      {
        users {
          id
        }
      }
    `
  );

  if (loading || !data) {
    return null;
  }

  return (
    <>
      {data.users.map(user => (
        <div key={user.id}>{user.id}</div>
      ))}
    </>
  );
};

export default LoginForm;
