import { queryOptions } from "@tanstack/react-query";
import axios from "redaxios";

import type { User, UsersResponse } from "../../../shared/types";
import { getRoute } from "./_utils";

export class UserNotFoundError extends Error {}

export const fetchUser = async (userId: string) => {
  const user = await axios
    .get<User>(getRoute(`/users/${userId}`))
    .then((r) => r.data)
    .catch((err) => {
      if (err.status === 404) {
        throw new UserNotFoundError(`User with id "${userId}" not found!`);
      }
      throw err;
    });

  return user;
};

export const fetchUsers = async () => {
  return axios.get<UsersResponse>(getRoute("/users")).then((r) => r.data);
};

export const usersQueryOptions = queryOptions({
  queryKey: ["users"],
  queryFn: fetchUsers,
});
