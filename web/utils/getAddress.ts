import { isServer } from "./isServer";

export const getAddress = (suffix?: string) => {
  let uri = "";

  const environment = process.env.NODE_ENV;

  const shouldUseStaging = process.env.USE_STAGING;

  if (environment === "development" && shouldUseStaging) {
    uri = process.env.STAGING_URL! + suffix;
  } else if (environment === "development" && isServer()) {
    uri = process.env.LOCAL_URL! + suffix;
  } else if (environment === "development" && !isServer()) {
    uri = "http://localhost:3050" + suffix;
  } else if (environment === "production") {
    // uri = process.env.STAGING_URL! + suffix;
    uri = "http://34.76.185.55" + suffix;
    // uri = process.env.STAGING_URL! + suffix;
  }

  return uri;
};
