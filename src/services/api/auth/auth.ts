import { environment } from "@/environments/dev";
import { User } from "@/interfaces/User";
import axios from "axios";

export class AuthApi {

   async login(user: User) {
      try {
         return await axios.post(`${environment.urlApi}/login`, user);
      } catch (error) {
         return error;
      }
   }
}