import { useApolloClient } from "@apollo/react-hooks";
import { useRouter } from "next/router";

import { useLogoutMutation, LogoutMutationResult } from "../generated/graphql";
import { deleteAccessToken } from "../utils/accessToken";

interface LogoutOptions {
  redirect: string | null;
}

type LogoutFunction = () => Promise<void>;

const useLogout = (
  options?: LogoutOptions
): [LogoutFunction, LogoutMutationResult] => {
  let opt: LogoutOptions = { redirect: "/" };

  if (options) {
    opt = options;
  }

  const [logout, mutationInformation] = useLogoutMutation();

  const client = useApolloClient();

  const { push } = useRouter();

  const fn = async () => {
    try {
      await logout();

      deleteAccessToken();

      if (opt.redirect) {
        push(opt.redirect);
      }

      await client.resetStore();
    } catch (e) {
      throw e;
    }
  };

  return [fn, mutationInformation];
};

export default useLogout;
