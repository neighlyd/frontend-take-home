import React from "react";

import { Link } from "@tanstack/react-router";
import { TabNav } from "@radix-ui/themes";

export const Nav = () => {
  return (
    <TabNav.Root>
      <TabNav.Link asChild active>
        <Link to="/users">Users</Link>
      </TabNav.Link>
      <TabNav.Link asChild>
        <Link to="/roles">Roles</Link>
      </TabNav.Link>
    </TabNav.Root>
  );
};
