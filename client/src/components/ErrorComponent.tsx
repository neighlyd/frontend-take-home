import React from "react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button, Flex, Heading, Text } from "@radix-ui/themes";

export const ErrorComponent = ({ error, reset }: ErrorComponentProps) => {
  return (
    <Flex gap="5" direction="column">
      <Heading as="h2">Error</Heading>
      <Text as="p">
        We're sorry, we encountered an error fetching your data. Please try
        again
      </Text>
      <Button onClick={reset}>Try again</Button>
    </Flex>
  );
};
