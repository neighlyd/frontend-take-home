import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQueries } from "@tanstack/react-query";

import { formatUsersList, usersQueryOptions } from "../api/users";
import { formatRoleMap, rolesQueryOptions } from "../api/roles";
import { SearchBar } from "../components/SearchBar";

export const Route = createFileRoute("/users")({
  component: RouteComponent,
  loader: async ({ context: { queryClient } }) => {
    await Promise.all([
      queryClient.ensureQueryData(usersQueryOptions),
      queryClient.ensureQueryData(rolesQueryOptions),
    ]);
  },
  pendingComponent: () => {
    return <SearchBar disabled type="user" />;
  },
});

function RouteComponent() {
  const usersList = useSuspenseQueries({
    queries: [usersQueryOptions, rolesQueryOptions],
    combine: ([usersRes, rolesRes]) => {
      if (usersRes.status === "success" && rolesRes.status === "success") {
        const roleMap = formatRoleMap(rolesRes.data);
        const usersList = formatUsersList(usersRes.data, roleMap);
        return usersList;
      }
    },
  });

  console.log("merged:", usersList);

  return <div>Hello "/users"!</div>;
}
