import { QueryClient } from "react-query";

import { apiBaseUrl } from "./constants";
import { defaultQueryFn } from "./defaultQueryFn";

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: async (e) => {
        console.log(e);
      },
    },
    queries: {
      retry: async (count, e) => {
        const error = JSON.parse(e.message);
        if (error.code === "token_not_valid") {
          return await refreshAuthToken();
        } else if (error.code === "bad_authorization_header") {
          localStorage.removeItem(accessTokenKey);
          localStorage.removeItem(refreshTokenKey);
          window.location.href = "/login";
        }
      },
      staleTime: 60 * 1000 * 1, // 5 minutes
      onError: (e) => {
        // refresh token if expired
        if (e.code === "token_not_valid") {
          window.location.href = "/login";
        }
        if (e.code === "bad_authorization_header") {
          window.location.href = "/login";
        }
      },
      queryFn: defaultQueryFn,
    },
  },
});

const refreshAuthToken = async () => {
  const { accessToken, refreshToken } = useTokenStore.getState();
  const r = await fetch(`${apiBaseUrl}account/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (r.status !== 200) {
    if (r.status === 401) {
      window.location.href = "/login";
    }
    throw new Error(await r.text());
  }
  const { access: newAccessToken } = await r.json();
  useTokenStore.setState({ accessToken: newAccessToken });
  return newAccessToken;
};
