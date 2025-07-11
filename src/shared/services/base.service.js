import httpInstance from "@/shared/services/http.instance.js";

export class BaseService {
    constructor(resourceEndpoint) {
        this.resourceEndpoint = resourceEndpoint;
    }

    getAll() {
        return httpInstance.get(this.resourceEndpoint) // Realiza la solicitud GET
            .then(r => {
                console.log('Respuesta de la API', r.data); // Aquí podemos ver los datos de la respuesta
                return r.data; // Devuelve los datos
            })
            .catch(error => {
                console.error(`Error fetching all from ${this.resourceEndpoint}`, error);
                return []; // En caso de error, devuelve un array vacío
            });
    }


    getById(id) {
        return httpInstance.get(`${this.resourceEndpoint}?id=${id}`)
            .then(r => Array.isArray(r.data) ? r.data[0] : r.data)
            .catch(error => {
                console.error(`Error fetching by ID from ${this.resourceEndpoint}`, error);
                return null;
            });
    }

    create(resource) {
        console.log("📦 Payload enviado a API:", JSON.stringify(resource));
        return httpInstance.post(this.resourceEndpoint, resource)
            .then(r => r.data)
            .catch(error => {
                console.error(`Error creating in ${this.resourceEndpoint}`, error);
                return null;
            });
    }

    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource)
            .then(r => r.data)
            .catch(error => {
                console.error(`Error updating in ${this.resourceEndpoint}`, error);
                return null;
            });
    }

    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`)
            .then(r => r.data)
            .catch(error => {
                console.error(`Error deleting in ${this.resourceEndpoint}`, error);
                return null;
            });
    }
}
