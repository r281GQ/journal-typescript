import Layout from "../components/Layout";

const Home = () => {
  return (
    <Layout>
      <div
        style={{
          textAlign: "center"
        }}
      >
        <div>home</div>
        <div>this route is accessible without logging in</div>
      </div>
    </Layout>
  );
};

export default Home;
