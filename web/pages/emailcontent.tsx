import withAuth from "../utils/withAuth";

const EmailContent = () => {
  return <div>this page requires the email to be verified</div>;
};

export default withAuth(EmailContent);
