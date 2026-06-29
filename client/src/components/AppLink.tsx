import React, { ComponentProps } from "react";

import { Link as RadixLink } from "@radix-ui/themes";
import { Link as TanstackLink } from "@tanstack/react-router";

interface AppLinkProps extends ComponentProps<typeof TanstackLink> {}

export const AppLink = ({ children, ...rest }: AppLinkProps) => {
  return (
    <RadixLink asChild>
      <TanstackLink {...rest}>{children}</TanstackLink>
    </RadixLink>
  );
};
