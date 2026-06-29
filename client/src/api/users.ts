import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQueries,
} from "@tanstack/react-query";
import axios from "redaxios";

import type { User, UsersResponse } from "../../../shared/types";
import { dateFormat, getRoute } from "./_utils";
import { formatRoleMap, rolesQueryOptions } from "./roles";

export class UserNotFoundError extends Error {}

export class UsersListError extends Error {}

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

export const fetchUsers = async (page?: number, search?: string) => {
  return axios
    .get<UsersResponse>(getRoute(`/users`), {
      params: {
        page,
        search,
      },
    })
    .then((r) => r.data);
};

export const usersQueryOptions = (page: number = 1, search?: string) =>
  queryOptions({
    queryKey: ["users", page, search],
    queryFn: () => fetchUsers(page, search),
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

export const useUserList = ({
  page,
  search,
}: {
  page?: number;
  search?: string;
}) => {
  const usersList = useSuspenseQueries({
    queries: [usersQueryOptions(page, search), rolesQueryOptions],
    combine: ([usersRes, rolesRes]) => {
      if (usersRes.status === "error" || rolesRes.status === "error") {
        throw new UsersListError();
      }
      const roleMap = formatRoleMap(rolesRes.data);
      const usersList = formatUsersList(usersRes.data, roleMap);
      const { next, prev, pages } = usersRes.data;

      return { usersList, next, prev, pages };
    },
  });

  return usersList;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => axios.delete(getRoute(`/users/${userId}`)),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return deleteMutation;
};

export type UserList = ReturnType<typeof useUserList>;
