import React, { useCallback } from "react";
import {
  AlertDialog,
  Avatar,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Table,
  Text,
} from "@radix-ui/themes";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";

import "./usersTable.css";

import type { UserList } from "../api/users";

const DeleteUser = ({ userName }: { userName: string }) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        {/* We need to stop the Dropdown menu from closing when selecting this option*/}
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          Delete user
        </DropdownMenu.Item>
      </AlertDialog.Trigger>

      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete user</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? The user {userName} will be permanently deleted.
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red">
              Delete user
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

const UsersTableRow = ({
  name,
  id,
  role,
  joined,
  photo,
  photoFallback,
}: NonNullable<UserList["usersList"]>[number]) => {
  return (
    <Table.Row>
      <Table.RowHeaderCell>
        <Flex gap="2">
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
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton
              variant="ghost"
              color="gray"
              aria-label="Open actions menu"
              radius="full"
            >
              <DotsHorizontalIcon />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content align="end">
            <DropdownMenu.Item>Edit user</DropdownMenu.Item>
            <DeleteUser userName={name} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Table.Cell>
    </Table.Row>
  );
};

export const UsersTable = ({ usersList, prev, next, pages }: UserList) => {
  return (
    <Table.Root variant="surface" className="hasFooter">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>User</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell
            justify="end"
            aria-label="actions"
          ></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body className="hasFooter">
        {usersList?.map((user) => (
          <UsersTableRow key={user.id} {...user} />
        ))}
      </Table.Body>
      <tfoot>
        <Table.Row>
          <Table.RowHeaderCell colSpan={4}>
            <Flex justify="end" gap="2">
              <Button
                color="gray"
                highContrast
                disabled={prev === null}
                asChild
              >
                <Link
                  to="."
                  search={(prev) => ({
                    ...prev,
                    page: prev.page != null ? prev.page - 1 : prev.page,
                  })}
                >
                  Previous
                </Link>
              </Button>
              <Button
                variant="surface"
                color="gray"
                highContrast
                disabled={next === null}
                asChild
              >
                <Link
                  to="."
                  search={(prev) => ({
                    ...prev,
                    page: prev.page != null ? prev.page + 1 : prev.page,
                  })}
                >
                  Next
                </Link>
              </Button>
            </Flex>
          </Table.RowHeaderCell>
        </Table.Row>
      </tfoot>
    </Table.Root>
  );
};
