import { createFileRoute } from "@tanstack/react-router";

import { Heading, Text } from "@radix-ui/themes";
import { AppLink } from "../components/AppLink";

export const Route = createFileRoute("/")({
  component: Home,
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
