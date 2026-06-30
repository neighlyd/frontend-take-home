import { Table } from "@radix-ui/themes";

export const UsersHeader = () => {
  return (
    <Table.Row>
      {/* Percentages based on Figma designs */}
      <Table.ColumnHeaderCell width="35%">User</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="32%">Role</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="27%">Joined</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell
        justify="end"
        aria-label="actions"
      ></Table.ColumnHeaderCell>
    </Table.Row>
  );
};

export const RolesHeader = () => {
  return (
    <Table.Row>
      {/* Percentages based on Figma designs */}
      <Table.ColumnHeaderCell width="65%">Role</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell width="25%">Created</Table.ColumnHeaderCell>
      <Table.ColumnHeaderCell
        justify="end"
        aria-label="actions"
      ></Table.ColumnHeaderCell>
    </Table.Row>
  );
};

export const TableHeader = ({ type }: { type: "users" | "roles" }) => {
  return (
    <Table.Header>
      {type === "users" ? <UsersHeader /> : <RolesHeader />}
    </Table.Header>
  );
};
