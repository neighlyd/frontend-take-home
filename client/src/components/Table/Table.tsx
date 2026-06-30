import { Button, Flex, Spinner, Table as RadixTable } from "@radix-ui/themes";
import { Link } from "@tanstack/react-router";

import { TableRows } from "./TableRow";
import { SkeletonRows } from "./SkeletonRows";

import type { UserList } from "../../api/users";
import type { PagedResponse, Role } from "../../../../shared/types";

import "./tableFooter.css";
import { TableHeader } from "./TableHeader";

type BaseTableProps = Pick<
  PagedResponse<unknown>,
  "next" | "prev" | "pages"
> & {
  isLoading: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
};

type TableProps =
  | (BaseTableProps & {
      dataList: UserList["usersList"];
      type: "users";
    })
  | (BaseTableProps & {
      dataList: Role[];
      type: "roles";
    });

export const Table = ({
  dataList,
  type,
  prev,
  next,
  pages,
  isLoading,
  isError,
  isPlaceholderData,
}: TableProps) => {
  const isPaginated = pages && pages > 1;
  return (
    <RadixTable.Root variant="surface">
      <TableHeader type={type} />

      <RadixTable.Body className={isPaginated ? "hasFooter" : undefined}>
        {!isLoading && !isError ? (
          // @ts-expect-error - React has a hard time with discriminated unions.
          <TableRows dataList={dataList} type={type} />
        ) : null}
        {isLoading && !isError ? <SkeletonRows num={3} type={type} /> : null}
      </RadixTable.Body>

      {isPaginated ? (
        <tfoot>
          <RadixTable.Row>
            <RadixTable.RowHeaderCell colSpan={type === "users" ? 4 : 3}>
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
            </RadixTable.RowHeaderCell>
          </RadixTable.Row>
        </tfoot>
      ) : null}
    </RadixTable.Root>
  );
};
