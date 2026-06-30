import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, IconButton, Tooltip } from "@radix-ui/themes";

import { DeleteDialog, DeleteDialogProps } from "./DeleteDialog";

export const TableMenu = ({
  name,
  id,
  type,
  isDefault,
}: Pick<DeleteDialogProps, "name" | "id" | "type"> & {
  isDefault?: boolean;
}) => {
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
        {isDefault ? (
          <Tooltip content={`Default ${type}s cannot be deleted`}>
            <DropdownMenu.Item disabled={isDefault}>
              Delete {type}
            </DropdownMenu.Item>
          </Tooltip>
        ) : (
          <DeleteDialog name={name} id={id} type={type} />
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
