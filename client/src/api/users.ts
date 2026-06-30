import React from "react";
import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { dateFormat, getRoute } from "./_utils";
import { axios } from "./axios";
import { formatRoleMap, rolesQueryOptions } from "./roles";

import type { User, UsersResponse } from "../../../shared/types";

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
    .get<UsersResponse>("/users", {
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
    placeholderData: keepPreviousData,
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
  const usersRes = useQuery(usersQueryOptions(page, search));
  const rolesRes = useQuery(rolesQueryOptions);

  const isLoading = usersRes.isLoading || rolesRes.isLoading;
  const isError = usersRes.isError || rolesRes.isError;
  const isPlaceholderData = usersRes.isPlaceholderData;

  let usersList: ReturnType<typeof formatUsersList> = [];
  let next, prev, pages;
  if (rolesRes.isSuccess && usersRes.isSuccess) {
    const roleMap = rolesRes.data;
    usersList = formatUsersList(usersRes.data, roleMap);
    next = usersRes.data.next;
    prev = usersRes.data.prev;
    pages = usersRes.data.pages;
  }

  return {
    isLoading,
    isError,
    usersList,
    isPlaceholderData,
    next,
    prev,
    pages,
  };
};

export const useDeleteUser = (onSuccessCallback?: (arg: boolean) => void) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => axios.delete(`/users/${userId}`),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      onSuccessCallback?.(true);
    },
  });

  return deleteMutation;
};

export type UserList = ReturnType<typeof useUserList>;
