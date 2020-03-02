import Link from "next/link";

const Home = () => {
  return (
    <>
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
          <button
            onClick={() => {
              fetch("http://localhost:3050/verify_email/3453", {
                method: "POST",
                credentials: "include"
              });
            }}
          >
            hit me
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
