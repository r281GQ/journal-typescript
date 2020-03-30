import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";

import Layout from "../components/Layout";
import { useCreateEntryMutation } from "../generated/graphql";
import withAuth from "../utils/withAuth";

export const ERROR_MESSAGE_TITLE_REQUIRED = "hey, please write something";
export const ERROR_MESSAGE_TITLE_MIN = "should be a bit longer than that";
export const ERROR_MESSAGE_TITLE_MAX =
  "writing a novel? please make it shorter";

export const ERROR_MESSAGE_BODY_REQUIRED = "hey, please write something";

export const ERROR_MESSAGE_TAGS_REQUIRED = "please, select at least one";
export const ERROR_MESSAGE_TAGS_MAX = "please, have at most three";

const CreateEntry = () => {
  const router = useRouter();

  const [handler, { error, loading }] = useCreateEntryMutation();

  const formik = useFormik<{ title: string; body: string; tags: string[] }>({
    initialValues: { title: "", body: "", tags: [] },
    validationSchema: Yup.object().shape({
      title: Yup.string()
        .required(ERROR_MESSAGE_TITLE_REQUIRED)
        .min(3, ERROR_MESSAGE_TITLE_MIN)
        .max(50, ERROR_MESSAGE_TITLE_MAX),
      body: Yup.string().required(ERROR_MESSAGE_BODY_REQUIRED),
      tags: Yup.array(Yup.string())
        .required(ERROR_MESSAGE_TAGS_REQUIRED)
        .max(3, ERROR_MESSAGE_TAGS_MAX)
    }),
    onSubmit: async values => {
      try {
        await handler({ variables: { data: values } });

        router.push("/");
      } catch {}
    }
  });

  return (
    <Layout>
      <div
        style={{
          display: "flex",
          flexDirection: "column"
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <div
            style={{
              margin: "12px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {error && error.message.replace("GraphQL error: ", "")}
            {loading && "loading..."}
            <label style={{ display: "block" }} htmlFor="title">
              title
            </label>
            <input
              id="title"
              name="title"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.title}
            />
            {formik.errors.title && formik.touched.title && formik.errors.title}
          </div>
          <div
            style={{
              margin: "12px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <label htmlFor="body">body</label>
            <textarea
              id="body"
              name="body"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.body}
            />
            {formik.errors.body && formik.touched.body && formik.errors.body}
          </div>
          <div
            style={{
              margin: "12px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <label htmlFor="tags">tags</label>
            <select
              id="tags"
              name="tags"
              multiple={true}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="react">react</option>
              <option value="docker">docker</option>
              <option value="typescript">typescript</option>
              <option value="graphql">graphql</option>
            </select>
            {formik.errors.tags && formik.touched.tags && formik.errors.tags}
          </div>
          <div
            style={{
              margin: "12px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <div style={{ margin: "0 4px" }}>
              <button type="submit">submit</button>
            </div>
            <div style={{ margin: "0 4px" }}>
              <button
                type="button"
                onClick={() => {
                  router.push("/");
                }}
              >
                cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default withAuth(CreateEntry, { withEmailVerification: false });
