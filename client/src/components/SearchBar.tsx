import React, { useMemo } from "react";
import { Route, useNavigate } from "@tanstack/react-router";

import { MagnifyingGlassIcon, PlusIcon } from "@radix-ui/react-icons";
import { Box, Button, Flex, TextField } from "@radix-ui/themes";
import type { DebouncedState } from "usehooks-ts";

export const SearchBar = ({
  disabled,
  type,
  onChange,
}: {
  disabled?: boolean;
  type: "role" | "user";
  onChange?: DebouncedState<(e: React.ChangeEvent<HTMLInputElement>) => void>;
}) => {
  const placeholder = useMemo(
    () => `Search by ${type === "user" ? "name" : "role"}`,
    [type],
  );

  const buttonText = useMemo(() => `Add ${type}`, [type]);

  return (
    <Flex gap="2">
      <Box asChild flexGrow="1">
        <TextField.Root
          placeholder={placeholder}
          disabled={disabled}
          onChange={onChange}
        >
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
