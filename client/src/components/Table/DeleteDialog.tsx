import { useState } from "react";
import { AlertDialog, Button, DropdownMenu, Flex } from "@radix-ui/themes";

import { useDelete } from "../../api/shared";

export interface DeleteDialogProps {
  name: string;
  id: string;
  type: "role" | "user";
}

export const DeleteDialog = ({ name, id, type }: DeleteDialogProps) => {
  const [open, setIsOpen] = useState(false);
  const { mutate, isPending, isError } = useDelete({
    type,
    id,
    onSuccess: setIsOpen,
  });

  return (
    <AlertDialog.Root open={open} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        {/* We need to stop the Dropdown menu from closing when selecting this option*/}
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          Delete {type}
        </DropdownMenu.Item>
      </AlertDialog.Trigger>

      <AlertDialog.Content
        maxWidth="488px"
        // We do not want the dialog to close during our deletion
        onEscapeKeyDown={(e) => isPending && e.preventDefault()}
      >
        <AlertDialog.Title>Delete {type}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {!isError
            ? `Are you sure? The ${type} ${name} will be permanently deleted.`
            : `There was an error trying to delete ${name}. Please try again`}
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
              loading={isPending}
              onClick={(e) => {
                // Stop the dialog from closing.
                e.preventDefault();
                mutate();
              }}
            >
              Delete {type}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
