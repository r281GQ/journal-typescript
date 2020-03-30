import { wait } from "@apollo/react-testing";
import userEvent from "@testing-library/user-event";
import { GraphQLError } from "graphql";
import { useRouter } from "next/router";

import { CreateEntryDocument } from "../../generated/graphql";
import CreateEntry from "../../pages/create_entry";
import { silenceConsoleError } from "../utils/silenceConsoleError";
import { wrapInApollo } from "../utils/wrapInApollo";

/**
 *  Mocks the modules globally and cannot be reset in this file.
 *  That means calling the mocking function is shared between all tests.
 */
jest.mock("next/router", () => {
  const push = jest.fn();

  const useRouter = jest.fn().mockImplementation(() => {
    return {
      push
    };
  });

  return {
    useRouter
  };
});

describe("<CreateEntry /> form submission", () => {
  silenceConsoleError();

  test("has all the required fields for the process", () => {
    const { queryByLabelText, queryByText } = wrapInApollo(<CreateEntry />);

    const title = queryByLabelText("title");
    const body = queryByLabelText("body");
    const tags = queryByLabelText("tags");
    const submitButton = queryByText("submit");
    const cancelButton = queryByText("cancel");

    expect(title).not.toBe(null);
    expect(body).not.toBe(null);
    expect(tags).not.toBe(null);
    expect(submitButton).not.toBe(null);
    expect(cancelButton).not.toBe(null);
  });

  test("successful submission redirects to home", async () => {
    const { queryByLabelText, queryByText } = wrapInApollo(<CreateEntry />, {
      mocks: [
        {
          request: {
            query: CreateEntryDocument,
            variables: {
              data: {
                title: "kkk",
                body: "kk",
                tags: ["react"]
              }
            }
          },
          result: {
            data: {
              createEntry: {
                title: "kk",
                body: "kk",
                tags: [],
                id: 1,
                __typename: "Entry"
              }
            }
          }
        }
      ]
    });

    const title = queryByLabelText("title");
    const body = queryByLabelText("body");
    const tags = queryByLabelText("tags");
    const submitButton = queryByText("submit");

    if (title && body && tags && submitButton) {
      userEvent.type(title, "kkk");
      userEvent.type(body, "kk");
      userEvent.selectOptions(tags, ["react"]);

      userEvent.click(submitButton);

      await wait(1000);

      const router = useRouter();

      return expect(router.push).toHaveBeenCalledTimes(1);
    }

    fail();
  });

  test("submission error shows up", async () => {
    const { queryByLabelText, queryByText } = wrapInApollo(<CreateEntry />, {
      mocks: [
        {
          request: {
            query: CreateEntryDocument,
            variables: {
              data: {
                title: "kkk",
                body: "kk",
                tags: ["react"]
              }
            }
          },
          result: {
            errors: [new GraphQLError("not authorized")]
          }
        }
      ]
    });

    const title = queryByLabelText("title");
    const body = queryByLabelText("body");
    const tags = queryByLabelText("tags");
    const submitButton = queryByText("submit");

    if (title && body && tags && submitButton) {
      userEvent.type(title, "kkk");
      userEvent.type(body, "kk");
      userEvent.selectOptions(tags, ["react"]);

      userEvent.click(submitButton);

      await wait(1000);

      const router = useRouter();

      /**
       *  1st time happened in previous test since module level mocks are part of the registry
       */
      expect(router.push).toHaveBeenCalledTimes(1);

      let errorMessage = queryByText("not authorized");

      return expect(errorMessage).not.toBe(null);
    }

    fail();
  });

  test("cancellation redirects to home", async () => {
    const { queryByText } = wrapInApollo(<CreateEntry />);

    const cancelButton = queryByText("cancel");

    if (cancelButton) {
      userEvent.click(cancelButton);

      const router = useRouter();

      return expect(router.push).toHaveBeenCalledTimes(2);
    }

    fail();
  });
});
