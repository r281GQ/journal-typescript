import { ENV, SELF_URL } from "../Environment";

export const createUrl = (suffix?: string) => {
  let url = "";

  if (ENV === "development") {
    url = "http://localhost:3050" + suffix;
  }

  if (ENV === "test") {
    url = SELF_URL + suffix;
  }

  if (ENV === "production") {
    url = SELF_URL + suffix;
  }

  return url;
};
