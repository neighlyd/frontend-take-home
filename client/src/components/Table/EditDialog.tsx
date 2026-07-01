import { useCallback, useState } from "react";
import {
  AlertDialog,
  Button,
  Callout,
  DropdownMenu,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";

import { useEdit } from "../../api/shared";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export interface EditDialogProps {
  name: string;
  id: string;
  type: "role" | "user";
}

export const EditDialog = ({ name, id, type }: EditDialogProps) => {
  const [open, setIsOpen] = useState(false);

  const { mutate, isPending, isError, error, ...rest } = useEdit({
    type,
    id,
    onSuccess: setIsOpen,
  });

  const handleSubmit = useCallback<React.SubmitEventHandler<HTMLFormElement>>(
    (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      const newName = formData.get("name");
      if (newName && newName !== name) {
        mutate({
          name: newName?.toString(),
        });
      }
    },
    [name],
  );

  return (
    <AlertDialog.Root open={open} onOpenChange={setIsOpen}>
      <AlertDialog.Trigger>
        {/* We need to stop the Dropdown menu from closing when selecting this option*/}
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          Edit {type}
        </DropdownMenu.Item>
      </AlertDialog.Trigger>

      <AlertDialog.Content
        maxWidth="488px"
        // We do not want the dialog to close during our deletion
        onEscapeKeyDown={(e) => isPending && e.preventDefault()}
      >
        <AlertDialog.Title>Delete {type}</AlertDialog.Title>
        {isError ? (
          <Callout.Root color="red" role="alert">
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            {/* @ts-expect-error - not sure why data isn't typing correctly here */}
            <Callout.Text>{error?.data?.message}</Callout.Text>
          </Callout.Root>
        ) : null}
        <form onSubmit={handleSubmit}>
          <label>
            <Text>Name</Text>
            <TextField.Root placeholder={name} name="name" />
          </label>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button loading={isPending} type="submit">
              Edit {type}
            </Button>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
