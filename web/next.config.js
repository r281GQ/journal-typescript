module.exports = {
  env: {
    USE_STAGING: process.env.USE_STAGING === "true" ? true : false,
    LOCAL_URL: process.env.LOCAL_URL,
    STAGING_URL: process.env.STAGING_URL
  }
};
