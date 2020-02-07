import { useUsersQuery } from "../src/generated/graphql";

const LoginForm: React.FC = ({}) => {
  const { data, loading } = useUsersQuery();

  if (loading || !data) {
    return null;
  }

  return (
    <>
      {data.users.map(user => (
        <div key={user.id}>
          {user.id} {user.__typename}
        </div>
      ))}
    </>
  );
};

export default LoginForm;
