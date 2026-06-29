import { queryOptions, useQuery } from "@tanstack/react-query";
import axios from "redaxios";

import type { RolesResponse } from "../../../shared/types";

export const fetchRoles = async () => {
  return axios
    .get<RolesResponse>("http://localhost:3002/roles")
    .then((r) => r.data);
};

function createRoleMap({ data }: RolesResponse) {
  return data.reduce((acc, role) => acc.set(role.id, role), new Map());
}

export const rolesQueryOptions = queryOptions({
  queryKey: ["roles"],
  queryFn: fetchRoles,
  select: createRoleMap,
});
