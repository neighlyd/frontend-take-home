import React from "react";

import { Link, useRouterState } from "@tanstack/react-router";
import { TabNav } from "@radix-ui/themes";

export const Nav = () => {
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  });

  return (
    <TabNav.Root>
      <TabNav.Link asChild active={currentPath === "/users"}>
        <Link to="/users">Users</Link>
      </TabNav.Link>
      <TabNav.Link asChild active={currentPath === "/roles"}>
        <Link to="/roles">Roles</Link>
      </TabNav.Link>
    </TabNav.Root>
  );
};
