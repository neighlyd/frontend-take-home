import { useState } from "react";
import axios from "redaxios";
import {
  AlertDialog,
  Avatar,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Skeleton,
  Spinner,
  Table,
  Text,
} from "@radix-ui/themes";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { getRoute } from "../api/_utils";

import type { UserList } from "../api/users";

import "./usersTable.css";

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

const SkeletonRow = () => {
  return (
    <Table.Row>
      <Table.RowHeaderCell>
        <Flex gap="2" align="center">
          <Skeleton>
            <Avatar radius="full" size="1" fallback="L" />
          </Skeleton>
          <Skeleton width="100%" />
        </Flex>
      </Table.RowHeaderCell>
      <Table.Cell>
        <Flex align="center">
          <Skeleton width="100%" />
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Flex align="center">
          <Skeleton width="100%" />
        </Flex>
      </Table.Cell>
      <Table.Cell></Table.Cell>
    </Table.Row>
  );
};

/**
 * We can adjust this as necessary.
 * It looks good on page 1, not page 2.
 *
 * We would ideally want to set this to the average number of our pages maybe?
 */
const skeletonArr = Array.from({ length: 1 }, (_, i) => i);

export const UsersTable = ({
  usersList,
  prev,
  next,
  pages,
  isLoading,
  isError,
  isPlaceholderData,
}: UserList) => {
  console.log(
    "isLoading:",
    isLoading,
    "isPlacholderData:",
    isPlaceholderData,
    "prev != null:",
    prev != null,
  );
  return (
    <Table.Root variant="surface" className="hasFooter">
      <Table.Header>
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
      </Table.Header>

      <Table.Body className="hasFooter">
        {!isLoading && !isError
          ? usersList?.map((user) => <UsersTableRow key={user.id} {...user} />)
          : null}
        {isLoading && !isError
          ? skeletonArr.map((i) => <SkeletonRow key={i} />)
          : null}
      </Table.Body>
      <tfoot>
        <Table.Row>
          <Table.RowHeaderCell colSpan={4}>
            <Flex justify="end" gap="2">
              <Button
                asChild
                color="gray"
                highContrast
                disabled={prev == null}
                variant={prev == null ? "solid" : "surface"}
              >
                <Link
                  to="."
                  search={(prev) => ({
                    ...prev,
                    page: prev.page != null ? prev.page - 1 : prev.page,
                  })}
                >
                  {/*
                   * We can't use `Button`'s loading prop when it wraps a `Link` with `asChild`.
                   * Its space-saving HTML structure ends up causing the spinner to place relative to the parent (Table in this case).
                   */}
                  <Spinner loading={isPlaceholderData && prev != null}>
                    Previous
                  </Spinner>
                </Link>
              </Button>

              <Button
                asChild
                highContrast
                color="gray"
                disabled={next == null}
                variant={next == null ? "solid" : "surface"}
              >
                <Link
                  to="."
                  search={(prev) => ({
                    ...prev,
                    page: prev.page != null ? prev.page + 1 : prev.page,
                  })}
                >
                  {/*
                   * We can't use `Button`'s loading prop when it wraps a `Link` with `asChild`.
                   * Its space-saving HTML structure ends up causing the spinner to place relative to the parent (Table in this case).
                   */}
                  <Spinner loading={isPlaceholderData && next != null}>
                    Next
                  </Spinner>
                </Link>
              </Button>
            </Flex>
          </Table.RowHeaderCell>
        </Table.Row>
      </tfoot>
    </Table.Root>
  );
};
