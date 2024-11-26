import { Role } from "./Role";

export interface User {
   pk_user?: number;
   c_name?: string;
   c_email?: string;
   c_password?: string;
   fk_role?: number;
   role?: Role;
   created_at?: string;
}