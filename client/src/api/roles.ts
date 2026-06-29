import { queryOptions, useQuery } from "@tanstack/react-query";
import axios from "redaxios";

import type { RolesResponse } from "../../../shared/types";
import { getRoute } from "./_utils";

export const fetchRoles = async () => {
  return axios.get<RolesResponse>(getRoute("/roles")).then((r) => r.data);
};

function createRoleMap({ data }: RolesResponse) {
  return data.reduce((acc, role) => acc.set(role.id, role), new Map());
}

export const rolesQueryOptions = queryOptions({
  queryKey: ["roles"],
  queryFn: fetchRoles,
  select: createRoleMap,
});
