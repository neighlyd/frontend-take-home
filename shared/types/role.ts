import { PagedResponse } from "./pagedResponse";

export interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  isDefault: boolean;
}

export interface RolesResponse extends PagedResponse<Role> {}
