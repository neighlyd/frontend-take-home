import type { PagedResponse } from "./pagedResponse";

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  first: string;
  last: string;
  roleId: string;
  photo?: string;
}

export interface UsersResponse extends PagedResponse<User> {}
