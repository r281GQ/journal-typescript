import Link from "next/link";

const Navigation = () => {
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
      {props.children}
    </div>
  );
};

export default Layout;