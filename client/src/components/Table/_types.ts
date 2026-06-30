import type { UserList } from "../../api/users";
import type { Role, User } from "../../../../shared/types";

export type TableRowProps =
  | {
      dataList: UserList["usersList"];
      type: "users";
    }
  | {
      dataList: Role[];
      type: "roles";
    };
