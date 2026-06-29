export const SERVER_URL = "http://localhost:3002";

export const getRoute = (route: string) => {
  return `${SERVER_URL}${route}`;
};

export const dateFormat = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "2-digit",
});
