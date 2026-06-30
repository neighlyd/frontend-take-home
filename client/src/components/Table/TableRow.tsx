import { Avatar, Flex, Table, Text } from "@radix-ui/themes";

import type { UserList } from "../../api/users";
import { TableMenu } from "./TableMenu";
import { Role, User } from "../../../../shared/types";

import { TableRowProps } from "./_types";
import { CheckIcon } from "@radix-ui/react-icons";

export const UserRow = ({
  name,
  id,
  role,
  joined,
  photo,
  photoFallback,
}: NonNullable<UserList["usersList"]>[number]) => {
  return (
    <Table.Row align="center">
      <Table.RowHeaderCell>
        <Flex gap="2" align="center">
          <Avatar src={photo} fallback={photoFallback} radius="full" size="1" />
          <Text>{name}</Text>
        </Flex>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Text>{role}</Text>
      </Table.Cell>
      <Table.Cell>
        <Text>{joined}</Text>
      </Table.Cell>
      <Table.Cell justify="start">
        <TableMenu name={name} id={id} type="user" />
      </Table.Cell>
    </Table.Row>
  );
};

export const RoleRow = ({ name, id, createdAt, isDefault }: Role) => {
  return (
    <Table.Row align="center">
      <Table.RowHeaderCell>
        <Text>{name}</Text>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Text>{createdAt}</Text>
      </Table.Cell>
      <Table.Cell>{isDefault ? <CheckIcon /> : null}</Table.Cell>
      <Table.Cell justify="start">
        <TableMenu name={name} id={id} type="role" isDefault={isDefault} />
      </Table.Cell>
    </Table.Row>
  );
};

export const TableRows = ({ type, dataList }: TableRowProps) => {
  if (type === "users") {
    return dataList.map((user) => <UserRow key={user.id} {...user} />);
  } else if (type === "roles") {
    return dataList.map((role) => <RoleRow key={role.id} {...role} />);
  }
};
