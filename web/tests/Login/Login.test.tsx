import { wait } from "@apollo/react-testing";
import { cleanup, fireEvent } from "@testing-library/react";

import { LoginDocument } from "../../generated/graphql";
import { wrapInApollo } from "../utils/wrapInApollo";
import { silenceConsoleError } from "../utils/silenceConsoleError";
import { GraphQLError } from "graphql";

const LOGIN = "<Login />";

describe(LOGIN, () => {
  silenceConsoleError();

  afterEach(cleanup);

  test("shows up errors from backend", async () => {
    jest.mock("next/link", () => {
      const Link: React.FC = props => <div>{props.children}</div>;

      return Link;
    });

    jest.mock("next/router", () => {
      const push = jest.fn();

      const useRouter = jest.fn().mockImplementation(() => {
        return {
          push,
          query: undefined
        };
      });

      return {
        useRouter
      };
    });

    const Login = require("../../pages/login").default;

    const { queryByText, queryByLabelText } = wrapInApollo(
      <Login alreadyLoggedIn={false} />,
      {
        mocks: [
          {
            request: {
              query: LoginDocument,
              variables: {
                data: {
                  email: "",
                  password: ""
                }
              }
            },
            error: new GraphQLError("email")
          }
        ]
      }
    );

    const emailField = queryByLabelText("email");
    const passwordField = queryByLabelText("password");
    const submitButton = queryByText("submit");

    if (emailField && passwordField && submitButton) {
      fireEvent.change(emailField, { target: { value: "" } });
      fireEvent.change(passwordField, { target: { value: "" } });

      fireEvent.click(submitButton);

      /**
       *  waitForDomChange does not work since dom changes multiple time - loadspinner
       */
      await wait(1000);

      const errorMessage = queryByText("Network error: email");

      expect(errorMessage).not.toBe(null);
    }
  });
});

describe(LOGIN, () => {
  silenceConsoleError();

  afterEach(cleanup);

  test("shows up errors from backend then it disappers on subsequent submission", async () => {
    jest.mock("next/link", () => {
      const Link: React.FC = props => <div>{props.children}</div>;

      return Link;
    });

    jest.mock("next/router", () => {
      const push = jest.fn();

      const useRouter = jest.fn().mockImplementation(() => {
        return {
          push,
          query: undefined
        };
      });

      return {
        useRouter
      };
    });

    const Login = require("../../pages/login").default;

    const { queryByText, queryByLabelText } = wrapInApollo(
      <Login alreadyLoggedIn={false} />,
      {
        mocks: [
          {
            request: {
              query: LoginDocument,
              variables: {
                data: {
                  email: "",
                  password: ""
                }
              }
            },
            result: {
              errors: [
                {
                  message: "email error",
                  locations: [],
                  extensions: [],
                  name: "",
                  path: [],
                  nodes: [],
                  positions: [],
                  originalError: null,
                  stack: "",
                  source: undefined
                }
              ]
            }
          },
          {
            request: {
              query: LoginDocument,
              variables: {
                data: {
                  email: "text",
                  password: ""
                }
              }
            },
            result: {
              data: {
                login: {
                  token: "hey"
                }
              }
            }
          }
        ]
      }
    );

    const emailField = queryByLabelText("email");
    const passwordField = queryByLabelText("password");
    const submitButton = queryByText("submit");

    if (emailField && passwordField && submitButton) {
      fireEvent.change(emailField, { target: { value: "" } });
      fireEvent.change(passwordField, { target: { value: "" } });

      fireEvent.click(submitButton);

      /**
       *  waitForDomChange does not work since dom changes multiple time - loadspinner
       */
      await wait(1000);

      const errorMessage = queryByText(/email error/);

      expect(errorMessage).not.toBe(null);

      fireEvent.change(emailField, { target: { value: "text" } });
    }
  });
});

describe(LOGIN, () => {
  silenceConsoleError();

  afterEach(cleanup);

  test("forgot password navigates to forgot password", () => {
    jest.mock("next/link", () => {
      const Link: React.FC = props => <div>{props.children}</div>;

      return Link;
    });

    jest.mock("next/router", () => {
      const push = jest.fn();

      const useRouter = jest.fn().mockImplementation(() => {
        return {
          push,
          query: {
            origin: "/emailcontent"
          }
        };
      });

      return {
        useRouter
      };
    });

    const Login = require("../../pages/login").default;

    const { queryByText, queryByLabelText } = wrapInApollo(
      <Login alreadyLoggedIn={false} />
    );

    const forgot = queryByText("forgot password?") as HTMLAnchorElement;

    expect(forgot).not.toBe(null);
    expect(forgot.href).toMatch("/forgot_password");
  });
});

describe("Login", () => {
  silenceConsoleError();

  afterEach(cleanup);

  test("when logged in, the login form should not be visible", async () => {
    jest.mock("next/router", () => {
      const push = jest.fn();

      return {
        __esModule: true,
        useRouter: () => {
          return {
            push,
            query: undefined
          };
        }
      };
    });

    const Login = (await import("../../pages/login")).default;

    const { queryByText } = wrapInApollo(<Login alreadyLoggedIn={true} />);

    const submitButton = queryByText("submit");

    expect(submitButton).toBe(null);
  });

  // test.only(`successful login navigates to "/authcontent"`, async () => {
  //   const password = "password";
  //   const email = "email@test.com";
  //   const destination = "/authcontent";

  //   const { push } = useRouter();

  //   const { queryByText, queryByLabelText } = wrapWithApollo(
  //     <Login alreadyLoggedIn={false} />,
  //     {
  //       mocks: [
  //         {
  //           request: {
  //             query: LoginDocument,
  //             variables: {
  //               data: {
  //                 password,
  //                 email
  //               }
  //             }
  //           },
  //           result: {
  //             data: {
  //               login: {
  //                 token: "token",
  //                 __typename: "Jwt"
  //               }
  //             }
  //           }
  //         }
  //       ]
  //     }
  //   );

  //   const emailField = queryByLabelText("email");
  //   const passwordField = queryByLabelText("password");

  //   const submitButton = queryByText("submit");

  //   if (emailField && passwordField && submitButton) {
  //     fireEvent.change(emailField, { target: { value: email } });
  //     fireEvent.change(passwordField, { target: { value: password } });

  //     fireEvent.click(submitButton);

  //     await wait(1000);

  //     expect(push).toHaveBeenCalledWith(destination);
  //   }
  // });

  // test.only("login", async () => {
  //   const s = wrapWithApollo(<Login alreadyLoggedIn={false} />, {
  //     mocks: [
  //       {
  //         request: {
  //           query: LoginDocument,
  //           variables: {
  //             data: {
  //               password: "something",
  //               email: ""
  //             }
  //           }
  //         },
  //         result: {
  //           data: {
  //             login: {
  //               token: "sdfsd",
  //               __typename: "JWT"
  //             }
  //           }
  //         }
  //       }
  //     ]
  //   });

  //   const { push } = useRouter();

  //   const { queryByText, queryByLabelText } = render(s);

  //   const submitButton = queryByText("submit");
  //   const passwordField = queryByLabelText("password");

  //   let typedValue = "something";

  //   if (passwordField) {
  //     fireEvent.change(passwordField, {
  //       target: { value: typedValue }
  //     });

  //     expect((passwordField as HTMLInputElement).value).toBe(typedValue);
  //   }

  //   // expect(passwordField).toBe("sd");
  //   if (submitButton) {
  //     fireEvent.click(submitButton);

  //     await wait(1000);

  //     expect(push).toHaveBeenCalledWith("/j");
  //   }
  // });

  // test("renders without crashing", async () => {
  //   let s = wrapWithApollo(<Login alreadyLoggedIn={false} />);

  //   const result = render(s);

  //   const { findByText, queryByText } = result;

  //   // await wait(100);

  //   const submitButton = queryByText("submit");
  //   // const submitButton = await findByText("logout");

  //   const forgot = queryByText("forgot password?") as HTMLAnchorElement;

  //   // fireEvent.click(forgot);

  //   expect(forgot.href).toBe("sdfsd");
  // });
});

export {};
