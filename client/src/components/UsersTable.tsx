import axios from "redaxios";
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

import { useDeleteUser, type UserList } from "../api/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getRoute } from "../api/_utils";
import { useState } from "react";

const DeleteUser = ({ userName, id }: { userName: string; id: string }) => {
  const [open, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => axios.delete(getRoute(`/users/${userId}`)),
    onSuccess: async () => {
      // If you're invalidating a single query
      await queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsOpen(false);
    },
  });

  return (
    <AlertDialog.Root open={open} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        {/* We need to stop the Dropdown menu from closing when selecting this option*/}
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          Delete user
        </DropdownMenu.Item>
      </AlertDialog.Trigger>

      {/* We do not want the dialog to close during our deletion */}
      <AlertDialog.Content
        maxWidth="488px"
        onEscapeKeyDown={(e) => deleteMutation.isPending && e.preventDefault()}
      >
        <AlertDialog.Title>Delete user</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {!deleteMutation.isError
            ? `Are you sure? The user ${userName} will be permanently deleted.`
            : `There was an error trying to delete ${userName}. Please try again`}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              variant="solid"
              color="red"
              loading={deleteMutation.isPending}
              onClick={(e) => {
                // Stop the dialog from closing.
                e.preventDefault();
                deleteMutation.mutate(id);
              }}
            >
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
            <DeleteUser userName={name} id={id} />
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
