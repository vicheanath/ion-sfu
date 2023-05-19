import { useState, useEffect } from "react";
import { accessTokenKey, useTokenStore } from "../modules/auth/useTokenStore";
import { api } from "./api";
import { apiBaseUrl } from "./constants";

const { accessToken } = useTokenStore.getState();

export const useFetch = (url, options) => {
  const [state, setState] = useState({
    isLoading: true,
    data: [],
    error: null,
  });
  const FetchData = () => {};
  useEffect(() => {
    fetch(apiBaseUrl + url, {
      ...options,
      headers: {
        ...options?.headers,
        Authorization: `Bearer ${accessToken}` || "",
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error(res.statusText);
        }
      })
      .then((data) => {
        setState(() => ({ isLoading: false, data: data, error: null }));
      })
      .catch((error) => {
        setState({ loading: false, data: null, error });
      });
  }, [url, options]);

  return state;
};
