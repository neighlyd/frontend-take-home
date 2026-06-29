export const SERVER_URL = "http://localhost:3002";

export const getRoute = (route: string) => {
  return `${SERVER_URL}${route}`;
};
