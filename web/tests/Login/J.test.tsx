import { wait } from "@apollo/react-testing";
import { cleanup, fireEvent } from "@testing-library/react";

import { LoginDocument } from "../../generated/graphql";
import { wrapInApollo } from "../utils/wrapInApollo";
import { silenceConsoleError } from "../utils/silenceConsoleError";

const LOGIN = "<Login />";

describe("oooo", () => {
  silenceConsoleError();

  afterEach(cleanup);

  test(`successful login navigates to "origin" if present`, async () => {
    const password = "password";
    const email = "email@test.com";

    const origin = "/emailcontent";

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

    const useRouter = require("next/router").useRouter;

    const router = useRouter();

    const { queryByText, queryByLabelText } = wrapInApollo(
      <Login alreadyLoggedIn={false} />,
      {
        mocks: [
          {
            request: {
              query: LoginDocument,
              variables: {
                data: {
                  password,
                  email
                }
              }
            },
            result: {
              data: {
                login: {
                  token: "token",
                  __typename: "Jwt"
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
      fireEvent.change(emailField, { target: { value: email } });
      fireEvent.change(passwordField, { target: { value: password } });

      fireEvent.click(submitButton);

      /**
       *  waitForDomChange does not work since dom changes multiple time - loadspinner
       */
      await wait(1000);

      expect(router.push).toHaveBeenCalledWith(origin);
    }
  });
});

describe("Login", () => {
  silenceConsoleError();

  afterEach(cleanup);

  // beforeEach(() => {
  //   jest.resetModules();
  // });

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
