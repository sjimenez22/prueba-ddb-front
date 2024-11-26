import { environment } from "@/environments/dev";
import { Project } from "@/interfaces/Project";
import axios from "axios";

export class ProjectApi {

   async getProjects() {
      return await axios.get(`${environment.urlApi}/projects`);
   }

   async getProject(id?: number) {
      try {
         return await axios.get(`${environment.urlApi}/projects/${id}`);
      } catch (error) {
         return error;
      }
   }

   async insertProject(data: Project) {
      try {
         return await axios.post(`${environment.urlApi}/projects`, data);
      } catch (error) {
         return error;
      }
   }

   async updateProject(data: Project) {
      try {
         return await axios.patch(`${environment.urlApi}/projects/${data.pk_project}`, data);
      } catch (error) {
         return error;
      }
   }

   async deleteProject(id?: number) {
      try {
         return await axios.delete(`${environment.urlApi}/projects/${id}`);
      } catch (error) {
         return error;
      }
   }
}