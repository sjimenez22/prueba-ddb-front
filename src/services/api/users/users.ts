import { environment } from "@/environments/dev";
import { User } from "@/interfaces/User";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export class UserApi {

   async getUserByEmail() {
      const cookie: string | undefined = Cookies.get('Authorization');
      const decoded: any = jwtDecode(cookie ?? '');

      return await axios.get(`${environment.urlApi}/users/${decoded.data.c_email}/get`);
   }

   async getUsers() {
      return await axios.get(`${environment.urlApi}/users`);
   }

   async getUser(id?: number) {
      try {
         return await axios.get(`${environment.urlApi}/users/${id}`);
      } catch (error) {
         return error;
      }
   }

   async insertUser(data: User) {
      try {
         return await axios.post(`${environment.urlApi}/users`, data);
      } catch (error) {
         return error;
      }
   }

   async updateUser(data: User) {
      try {
         return await axios.patch(`${environment.urlApi}/users/${data.pk_user}`, data);
      } catch (error) {
         return error;
      }
   }

   async deleteUser(id?: number) {
      try {
         return await axios.delete(`${environment.urlApi}/users/${id}`);
      } catch (error) {
         return error;
      }
   }
}