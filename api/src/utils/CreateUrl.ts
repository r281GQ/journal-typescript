import { ENV, STAGING_URL } from "../Environment";

export const createUrl = (suffix?: string) => {
  let url = "";

  if (ENV === "development") {
    url = "http://localhost:3050" + suffix;
  }

  if (ENV === "test") {
    url = STAGING_URL + suffix;
  }

  return url;
};
