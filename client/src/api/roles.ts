import {
  keepPreviousData,
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { axios } from "./axios";

import type { Role, RolesResponse } from "../../../shared/types";
import { dateFormat } from "./_utils";

export class RolesMapError extends Error {}

export const fetchRoles = async (page: number = 1, search: string = "") => {
  return axios
    .get<RolesResponse>("/roles", { params: { page, search } })
    .then((r) => r.data);
};

const formatRole = ({ createdAt, updatedAt, ...rest }: Role) => ({
  createdAt: dateFormat.format(new Date(createdAt)),
  updatedAt: dateFormat.format(new Date(updatedAt)),
  ...rest,
});

const formatRolesList = ({ data, next, prev, pages }: RolesResponse) => ({
  rolesList: data.map(formatRole),
  next,
  prev,
  pages,
});

export const rolesQueryOptions = (page?: number, search?: string) =>
  queryOptions({
    queryKey: ["roles", page, search],
    queryFn: () => fetchRoles(page, search),
    select: formatRolesList,
    placeholderData: keepPreviousData,
    retry: 3,
  });

export const formatRoleMap = ({ data }: RolesResponse) => {
  return data.reduce<Map<string, Role>>(
    (acc, role) => acc.set(role.id, formatRole(role)),
    new Map(),
  );
};

export const rolesMapQueryOptions = queryOptions({
  queryKey: ["roles"],
  queryFn: () => fetchRoles(),
  select: formatRoleMap,
  placeholderData: keepPreviousData,
  retry: 3,
});
