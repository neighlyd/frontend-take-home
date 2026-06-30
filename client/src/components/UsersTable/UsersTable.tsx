import { useState } from "react";
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

import { DeleteUserDialog } from "./DeleteUserDialog";

import type { UserList } from "../../api/users";

import "./usersTable.css";

const UsersTableRow = ({
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
            <DeleteUserDialog userName={name} id={id} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Table.Cell>
    </Table.Row>
  );
};

const SkeletonRow = () => {
  return (
    <Table.Row align="center">
      <Table.RowHeaderCell>
        <Flex gap="2" align="center">
          <Skeleton>
            <Avatar radius="full" size="1" fallback="L" />
          </Skeleton>
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
  );
};

/**
 * We can adjust this as necessary.
 * We would ideally want to set this to the average number of our pages maybe?
 */
const skeletonArr = Array.from({ length: 3 }, (_, i) => i);

export const UsersTable = ({
  usersList,
  prev,
  next,
  pages,
  isLoading,
  isError,
  isPlaceholderData,
}: UserList) => {
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
