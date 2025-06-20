import { BaseService } from "@/shared/services/base.service.js";
import httpInstance from "@/shared/services/http.instance.js";

export class ProfileService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_PROFILES_ENDPOINT_PATH);
    }

    getByType(type) {
        return httpInstance.get(`${this.resourceEndpoint}?tipo=${type}`)
            .then(r => r.data);
    }
getById(id) {
  return httpInstance.get(`${this.resourceEndpoint}/${id}`)
    .then(r => r.data)
    .catch(error => {
      console.error(`Error fetching profile with ID ${id}`, error);
      return null;
    });
}

    getByEmail(email) {
        return httpInstance.get(`${this.resourceEndpoint}?email=${email}`)
            .then(r => r.data);
    }
    update(id, data) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, data)
            .then(res => res.data)
            .catch(error => {
                console.error("Error actualizando perfil:", error);
                throw error;
            });
    }

}
