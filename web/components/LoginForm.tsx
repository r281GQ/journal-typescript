import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const LoginForm: React.FC = ({}) => {
  const { data, loading } = useQuery<{ users: [{ id: number }] }>(
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
        <div>{user.id}</div>
      ))}
    </>
  );
};

export default LoginForm;
