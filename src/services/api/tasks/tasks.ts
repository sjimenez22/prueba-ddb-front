import { environment } from "@/environments/dev";
import { Task } from "@/interfaces/Task";
import axios from "axios";

export class TaskApi {

   async getTasks() {
      return await axios.get(`${environment.urlApi}/tasks`);
   }

   async getTask(id?: number) {
      try {
         return await axios.get(`${environment.urlApi}/tasks/${id}`);
      } catch (error) {
         return error;
      }
   }

   async getTasksByUser(id?: number) {
      try {
         return await axios.get(`${environment.urlApi}/tasks/user/${id}`);
      } catch (error) {
         return error;
      }
   }

   async getTasksByProject(idProject?: number) {
      try {
         return await axios.get(`${environment.urlApi}/tasks/project/${idProject}`);
      } catch (error) {
         return error;
      }
   }

   async insertTask(data: Task) {
      try {
         return await axios.post(`${environment.urlApi}/tasks`, data);
      } catch (error) {
         return error;
      }
   }

   async updateTask(data: Task) {
      try {
         return await axios.patch(`${environment.urlApi}/tasks/${data.pk_task}`, data);
      } catch (error) {
         return error;
      }
   }

   async deleteProject(id?: number) {
      try {
         return await axios.delete(`${environment.urlApi}/tasks/${id}`);
      } catch (error) {
         return error;
      }
   }
}