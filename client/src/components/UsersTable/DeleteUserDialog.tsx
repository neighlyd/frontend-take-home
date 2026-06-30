import { useState } from "react";
import { AlertDialog, Button, DropdownMenu, Flex } from "@radix-ui/themes";

import { useDeleteUser } from "../../api/users";

import "./usersTable.css";

export const DeleteUserDialog = ({
  userName,
  id,
}: {
  userName: string;
  id: string;
}) => {
  const [open, setIsOpen] = useState(false);
  const deleteMutation = useDeleteUser(setIsOpen);

  return (
    <AlertDialog.Root open={open} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        {/* We need to stop the Dropdown menu from closing when selecting this option*/}
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          Delete user
        </DropdownMenu.Item>
      </AlertDialog.Trigger>

      <AlertDialog.Content
        maxWidth="488px"
        // We do not want the dialog to close during our deletion
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
