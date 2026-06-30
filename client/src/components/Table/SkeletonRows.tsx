import { useMemo } from "react";

import { Avatar, Flex, Skeleton, Table } from "@radix-ui/themes";

export const SkeletonRows = ({
  num,
  type,
}: {
  num: number;
  type: "users" | "roles";
}) => {
  const arr = useMemo(() => Array.from({ length: num }, (_, i) => i), [num]);
  /**
   * The layout here is identical to our TableRow;
   * However, our TableRow requires a fair bit of information that we simply won't have access to during initial load when our Table data is first loading.
   */
  return arr.map((i) => (
    <Table.Row align="center" key={i}>
      <Table.RowHeaderCell>
        <Flex gap="2" align="center">
          {type === "users" ? (
            <Skeleton>
              <Avatar radius="full" size="1" fallback="Loading" />
            </Skeleton>
          ) : null}
          <Skeleton width="100%" />
        </Flex>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Skeleton width="100%" />
      </Table.Cell>
      <Table.Cell>
        <Flex>
          <Skeleton width="100%" />
        </Flex>
      </Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  ));
};
