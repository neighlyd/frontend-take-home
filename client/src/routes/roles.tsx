import z from "zod";
import { useDebounceCallback } from "usehooks-ts";
import { createFileRoute } from "@tanstack/react-router";

import { RolesMapError, rolesQueryOptions } from "../api/roles";
import { SearchBar } from "../components/SearchBar";
import { Table } from "../components/Table/Table";
import { ErrorComponent } from "../components/ErrorComponent";
import { useQuery } from "@tanstack/react-query";

const rolesSearchParams = z.object({
  page: z.number().default(1),
  search: z.string().default(""),
});

export const Route = createFileRoute("/roles")({
  component: RouteComponent,
  preloadStaleTime: 0,
  validateSearch: rolesSearchParams,
  loaderDeps: ({ search: { page, search } }) => ({
    page,
    search,
  }),
  loader: async ({ context: { queryClient }, deps: { page, search } }) => {
    // prefetch our data
    Promise.all([queryClient.ensureQueryData(rolesQueryOptions(page, search))]);
  },
  errorComponent: ErrorComponent,
});

function RouteComponent() {
  const { page, search } = Route.useSearch();
  const { data, ...rolesRes } = useQuery(rolesQueryOptions(page, search));
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

  if (rolesRes.isError) {
    throw new RolesMapError();
  }

  return (
    <>
      <SearchBar
        type="role"
        onChange={handleInputChange}
        disabled={rolesRes.isLoading}
      />
      {data ? (
        <Table dataList={data.rolesList} type="roles" {...data} {...rolesRes} />
      ) : (
        <Table
          isLoading
          type="roles"
          dataList={[]}
          isError={false}
          isPlaceholderData={false}
          next={null}
          prev={null}
          pages={undefined}
        />
      )}
    </>
  );
}
