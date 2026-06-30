import { queryOptions } from "@tanstack/react-query";
import { axios } from "./axios";

import type { Role, RolesResponse } from "../../../shared/types";

export const fetchRoles = async () => {
  return axios.get<RolesResponse>("/roles").then((r) => r.data);
};

export const formatRoleMap = ({ data }: RolesResponse) => {
  return data.reduce<Map<string, Role>>(
    (acc, role) => acc.set(role.id, role),
    new Map(),
  );
};

export const rolesQueryOptions = queryOptions({
  queryKey: ["roles"],
  queryFn: fetchRoles,
  select: formatRoleMap,
  retry: 3,
});
