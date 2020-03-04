import Link from "next/link";

const Home = () => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Link href="/login">
          <div>Login</div>
        </Link>
        <Link href="/register">
          <div>Register</div>
        </Link>
        <Link href="/authcontent">
          <div>auth</div>
        </Link>
        <Link href="/emailcontent">
          <div>email</div>
        </Link>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minHeight: "100vh"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          home route
        </div>
      </div>
    </div>
  );
};

export default Home;
