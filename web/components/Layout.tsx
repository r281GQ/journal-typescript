import Link from "next/link";

import useLogout from "../hooks/Logout";
import { useMeQuery } from "../generated/graphql";

const Navigation: React.FC = () => {
  const { data } = useMeQuery();
  const [logout] = useLogout();

  return (
    <div
      style={{
        display: "flex",
        padding: "16px",
        justifySelf: "stretch",
        justifyContent: "space-between"
      }}
    >
      <Link href="/">
        <a href="/">home</a>
      </Link>
      <Link href="/login">
        <a href="/login">login</a>
      </Link>
      <Link href="/register">
        <a href="/register">register</a>
      </Link>
      <Link href="/authcontent">
        <a href="/authcontent">auth</a>
      </Link>
      <Link href="/emailcontent">
        <a href="/emailcontent">email</a>
      </Link>
      <Link href="/create_entry">
        <a href="/create_entry">create entry</a>
      </Link>
      {data && data.me && (
        <div
          onClick={async () => {
            try {
              await logout();
            } catch {}
          }}
        >
          logout
        </div>
      )}
    </div>
  );
};

const Layout: React.FC = props => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "30px 1fr",
        alignItems: "center",
        justifyItems: "center",
        minHeight: "100vh"
      }}
    >
      <Navigation />
      <div>{props.children}</div>
    </div>
  );
};

export default Layout;
