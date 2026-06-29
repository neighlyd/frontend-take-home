import React, { useMemo } from "react";

import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";

export const SearchBar = ({
  disabled,
  type,
}: {
  disabled: boolean;
  type: "role" | "user";
}) => {
  const placeholder = useMemo(
    () => `Search by ${type === "user" ? "name" : "role"}`,
    [type],
  );

  const buttonText = useMemo(() => `Add ${type.toUpperCase()}`, [type]);

  return (
    <Flex gap="2">
      <Box asChild flexGrow="1">
        <TextField.Root placeholder={placeholder} disabled={disabled}>
          <TextField.Slot>
            <MagnifyingGlassIcon height="16" width="16" />
          </TextField.Slot>
        </TextField.Root>
      </Box>
      <Button disabled={disabled}>
        <PlusIcon /> {buttonText}
      </Button>
    </Flex>
  );
};
