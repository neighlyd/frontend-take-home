import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";

import { rolesQueryOptions } from "../api/roles";
import { Heading, Text } from "@radix-ui/themes";
import { AppLink } from "../components/AppLink";
import { usersQueryOptions } from "../api/users";

export const Route = createFileRoute("/")({
  component: Home,
  loader: ({ context }) => {
    /**
     * We are firing off a prefetch event for our data, so they will be ready once we land anywhere.
     * Because we aren't resolving these, they won't be blocking our initial load.
     *
     * @see https://tanstack.com/router/latest/docs/integrations/query#prefetching-and-streaming
     */
    context.queryClient.fetchQuery(rolesQueryOptions);
    context.queryClient.fetchQuery(usersQueryOptions(1));
  },
});

function Home() {
  return (
    <div>
      <Heading>Welcome!</Heading>
      <Text as="p">Let's get started.</Text>
      <Text as="p">
        Please select either <AppLink to="/users">Users</AppLink> or{" "}
        <AppLink to="/roles">Roles</AppLink> to get started
      </Text>
    </div>
  );
}
