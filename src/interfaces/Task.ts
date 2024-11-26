import { Project } from "./Project";
import { StatusTask } from "./StatusTask";
import { User } from "./User";

export interface Task {
   pk_task?: number;
   c_name?: string;
   c_description?: string;
   d_completion?: string;
   fk_project?: number;
   fk_status?: number;
   fk_user_responsible?: number;
   fk_user_creator?: number;
   created_at?: string;
   updated_at?: string;
   project?: Project;
   user_responsible?: User;
   user_creator?: User;
   status_task?: StatusTask;
}