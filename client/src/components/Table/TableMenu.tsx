import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton } from "@radix-ui/themes";

import { DeleteDialog, DeleteDialogProps } from "./DeleteDialog";

export const TableMenu = ({
  name,
  id,
  type,
}: Pick<DeleteDialogProps, "name" | "id" | "type">) => {
  return (
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
        <DeleteDialog name={name} id={id} type={type} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
