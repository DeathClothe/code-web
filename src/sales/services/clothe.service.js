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



    update(clothe) {
        return super.update(clothe.id, clothe);
    }
}
