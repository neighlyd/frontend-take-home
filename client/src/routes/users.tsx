import { useEffect } from "react";
import z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { createFileRoute } from "@tanstack/react-router";

import { UsersListError, usersQueryOptions, useUserList } from "../api/users";
import { rolesMapQueryOptions } from "../api/roles";
import { SearchBar } from "../components/SearchBar";
import { Table } from "../components/Table/Table";
import { ErrorComponent } from "../components/ErrorComponent";

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
      queryClient.ensureQueryData(rolesMapQueryOptions),
    ]);
  },
  pendingComponent: () => {
    return (
      <>
        <SearchBar disabled type="user" />
        <Table
          isLoading
          type="users"
          dataList={[]}
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
  const { usersList, ...usersRes } = useUserList({ page, search });
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

  if (usersRes.isError) {
    throw new UsersListError();
  }

  return (
    <>
      <SearchBar
        type="user"
        onChange={handleInputChange}
        disabled={usersRes.isLoading}
        isPlaceholderData={usersRes.isPlaceholderData}
      />
      {usersList ? (
        <Table dataList={usersList} type="users" {...usersRes} />
      ) : null}
    </>
  );
}
