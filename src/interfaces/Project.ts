import { User } from "./User";

export interface Project {
   pk_project?: number;
   c_name?: string;
   created_at?: string;
   updated_at?: string;
   user?: User;
   fk_user?: number;
}