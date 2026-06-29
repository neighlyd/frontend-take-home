import { createFileRoute } from "@tanstack/react-router";

import { usersQueryOptions, useUserList } from "../api/users";
import { rolesQueryOptions } from "../api/roles";
import { SearchBar } from "../components/SearchBar";
import { UsersTable } from "../components/UsersTable";
import { ErrorComponent } from "../components/ErrorComponent";
import { useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";

type UserListSearch = {
  page: number;
  search: string;
};

export const Route = createFileRoute("/users")({
  component: RouteComponent,
  preloadStaleTime: 0,
  validateSearch: (search: Record<string, unknown>): UserListSearch => {
    // validate and parse the search params into a typed state
    return {
      page: Number(search?.page ?? 1),
      search: (search.search as string) || "",
    };
  },
  loaderDeps: ({ search: { page, search } }) => ({
    page,
    search,
  }),
  loader: async ({ context: { queryClient }, deps: { page, search } }) => {
    // prefetch our data
    await Promise.all([
      queryClient.ensureQueryData(usersQueryOptions(page, search)),
      queryClient.ensureQueryData(rolesQueryOptions),
    ]);
  },
  pendingComponent: () => {
    return <SearchBar disabled type="user" />;
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const { page, search } = Route.useSearch();
  const usersList = useUserList({ page, search });
  const navigate = Route.useNavigate();

  const handleInputChange = useDebounceCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      navigate({
        search: {
          // When a user searches, we want to return to page 1.
          page: 1,
          search: e.target.value,
        },
      });
    },
    150, // setting this at a 150ms debounce. We can adjust later
  );

  return (
    <>
      <SearchBar type="user" onChange={handleInputChange} />
      {usersList ? <UsersTable {...usersList} /> : null}
    </>
  );
}
