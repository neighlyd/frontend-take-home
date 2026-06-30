import { createFileRoute } from "@tanstack/react-router";

import { usersQueryOptions, useUserList } from "../api/users";
import { rolesQueryOptions } from "../api/roles";
import { SearchBar } from "../components/SearchBar";
import { UsersTable } from "../components/UsersTable";
import { ErrorComponent } from "../components/ErrorComponent";
import { useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
import z from "zod";

type UserListSearch = {
  page: number;
  search: string;
};

const usersSearchParams = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
});

export const Route = createFileRoute("/users")({
  component: RouteComponent,
  preloadStaleTime: 0,
  validateSearch: usersSearchParams,
  loaderDeps: ({ search: { page, search } }) => ({
    page,
    search,
  }),
  loader: async ({ context: { queryClient }, deps: { page, search } }) => {
    // prefetch our data
    Promise.all([
      queryClient.ensureQueryData(usersQueryOptions(page, search)),
      queryClient.ensureQueryData(rolesQueryOptions),
    ]);
  },
  pendingComponent: () => {
    return (
      <>
        <SearchBar disabled type="user" />
        <UsersTable
          isLoading
          usersList={[]}
          isError={false}
          isPlaceholderData={false}
          next={null}
          prev={null}
          pages={undefined}
        />
      </>
    );
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const { page, search } = Route.useSearch();
  const usersRes = useUserList({ page, search });
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

  useEffect(() => {
    // If we delete the last user on a page, we will want to go back a page.
    if (usersRes.pages && page > usersRes.pages) {
      navigate({
        search: (previous) => ({
          ...previous,
          page: previous.page - 1,
        }),
      });
    }
  }, [page, usersRes.pages]);

  return (
    <>
      <SearchBar
        type="user"
        onChange={handleInputChange}
        disabled={usersRes.isLoading}
      />
      {usersRes ? <UsersTable {...usersRes} /> : null}
    </>
  );
}
