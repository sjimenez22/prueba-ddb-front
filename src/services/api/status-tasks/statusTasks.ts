import { environment } from "@/environments/dev";
import axios from "axios";

export class StatusTaskApi {

   async getStatusTasks() {
      return await axios.get(`${environment.urlApi}/task/status`);
   }
}