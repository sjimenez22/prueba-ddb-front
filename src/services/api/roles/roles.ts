import { environment } from "@/environments/dev";
import axios from "axios";

export class RolesApi {

   async getRoles() {
      return await axios.get(`${environment.urlApi}/roles`);
   }
}