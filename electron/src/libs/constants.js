// export const __prod__ = process.env.NODE_ENV === "production";
export const __prod__ = true;

export const apiBaseUrl = __prod__
  ? "https://cs-api.onebeta.club/api/v1/"
  : "http://127.0.0.1:8181/api/v1/";
