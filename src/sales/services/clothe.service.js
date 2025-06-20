import { BaseService } from "@/shared/services/base.service.js";
import httpInstance from "@/shared/services/http.instance.js";

export class ClotheService extends BaseService {
    constructor() {
        super(import.meta.env.VITE_CLOTHES_ENDPOINT_PATH);
    }

    // ✅ Corrección: getById usando /clothes/:id en lugar de ?id=
    getById(id) {
        const url = `${this.resourceEndpoint}/${id}`;
        console.log("ClotheService.getById():", url); // 🔍 Para depuración
        return httpInstance.get(url)
            .then(res => res.data)
            .catch(error => {
                console.error(`Error fetching clothe with ID ${id}:`, error);
                return null;
            });
    }

    getByUserId(userId) {
        return httpInstance.get(`${this.resourceEndpoint}?usuario=${userId}`)
            .then(r => r.data)
            .catch(error => {
                console.error(`Error fetching clothes for user ID ${userId}`, error);
                return [];
            });
    }

    getByEstado(estado) {
        return httpInstance.get(`${this.resourceEndpoint}?estado=${estado}`)
            .then(r => r.data)
            .catch(error => {
                console.error(`Error fetching clothes by estado`, error);
                return [];
            });
    }

    getByName(name) {
        return httpInstance.get(`${this.resourceEndpoint}?nombre_like=${name}`)
            .then(r => r.data)
            .catch(error => {
                console.error(`Error fetching clothes by name`, error);
                return [];
            });
    }

    update(clothe) {
        return super.update(clothe.id, clothe);
    }
}
