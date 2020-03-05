let accessToken: string | null;

export const deleteAccessToken = () => {
  accessToken = null;
};

export const getAccessToken = () => {
  return accessToken;
};

export const setAccessToken = (token: string) => {
  accessToken = token;
};
