import { queryOptions } from "@tanstack/react-query";
import axios from "redaxios";

import type { User, UsersResponse } from "../../../shared/types";
import { dateFormat, getRoute } from "./_utils";
import { formatRoleMap, rolesQueryOptions } from "./roles";

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
  retry: 3,
});

export const formatUsersList = (
  { data }: UsersResponse,
  roleMap: ReturnType<typeof formatRoleMap>,
) => {
  return data.map((user) => {
    return {
      id: user.id,
      name: `${user.first} ${user.last}`,
      role: roleMap.get(user.roleId)?.name,
      joined: dateFormat.format(new Date(user.createdAt)),
      photo: user.photo,
      photoFallback: user.first.slice(0, -1),
    };
  });
};
