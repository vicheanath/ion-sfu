import { apiBaseUrl } from "./constants";

export const defaultQueryFn = async ({ queryKey }) => {
  // const { accessToken } = useTokenStore.getState();
  const r = await fetch(`${apiBaseUrl}${queryKey}`, {
    headers: {
      Authorization: `Bearer `,
    },
  });
  if (r.status !== 200) {
    throw new Error(await r.text());
  }
  return await r.json();
};
